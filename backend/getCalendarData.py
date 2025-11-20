from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException, NoSuchElementException
import time
import json

driver = webdriver.Chrome()

calendar_data = []

try:
    driver.get("https://ys.learnus.org/") 

    wait = WebDriverWait(driver, 10)
    
    calendar_table_selector = "table.minicalendar.calendartable"
    day_cell_selector = "tr[data-region='month-view-week'] td.day"
    
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, calendar_table_selector)))
    time.sleep(1) 
    
    print("✅ 달력 테이블 로드 완료.")

    calendar_table = driver.find_element(By.CSS_SELECTOR, calendar_table_selector)
    
    temp_cells = calendar_table.find_elements(By.CSS_SELECTOR, day_cell_selector)
    total_cells = len(temp_cells)

    print(f"✅ 총 {total_cells}개의 달력 셀(날짜) 개수를 확인했습니다.")

    for i in range(total_cells):
        try:
            # Stale Element 방지를 위해 루프마다 요소를 다시 찾습니다.
            all_cells_in_current_dom = calendar_table.find_elements(By.CSS_SELECTOR, day_cell_selector)
            
            if i >= len(all_cells_in_current_dom):
                break
                
            cell = all_cells_in_current_dom[i]

            # filler 셀 건너뛰기
            cell_class = cell.get_attribute('class')
            if 'filler' in cell_class:
                 continue
                 
            date_text = "N/A"
            try:
                date_element = cell.find_element(By.TAG_NAME, "a")
                date_text = date_element.get_attribute("textContent").strip()
            except NoSuchElementException:
                # 날짜 링크가 없는 경우 (HTML 구조상 td의 텍스트가 날짜인 경우)
                date_text = cell.get_attribute("textContent").strip()

            print(f"\n--- {date_text}일자 셀:")
            
            # --- 데이터 추출 및 저장 로직 ---
            day_events = [] # 해당 날짜의 일정을 저장할 임시 리스트

            try:
                # 숨겨진 'div.hidden' 요소를 찾고 그 안의 일정 목록을 찾습니다.
                hidden_div = cell.find_element(By.CSS_SELECTOR, "div.hidden")
                events = hidden_div.find_elements(By.CSS_SELECTOR, "div[data-popover-eventtype-course='1']")
                
                if events:
                    print("  🔔 일정:")
                    for ev in events:
                        event_full_text = ev.get_attribute('textContent').strip()
                        clean_text = ' '.join(event_full_text.split())
                        print(f"   - {clean_text}")
                        
                        # 추출된 일정을 day_events 리스트에 추가합니다.
                        day_events.append(clean_text) 
                else:
                    print("  ❌ 일정 없음")
                    
            except NoSuchElementException:
                print("  ❌ 일정 없음")
            except StaleElementReferenceException:
                print("  ⚠️ 일정 추출 중 Stale Element 오류 발생 (스킵)")


            # 5. 추출된 날짜와 일정을 JSON 데이터 구조에 추가합니다.
            if date_text and date_text != "N/A":
                calendar_data.append({
                    "date": f"2025년 11월 {date_text}일", # 연/월 정보는 캡처된 HTML을 기준으로 수동으로 추가
                    "events": day_events
                })


        except StaleElementReferenceException:
            print(f"  ⚠️ 인덱스 {i}에서 심각한 Stale Element 오류 발생 (건너뜀)")
            
        except Exception as e:
            print(f"  🚨 예상치 못한 오류 발생: {e}")

finally:
    driver.quit()
    
    if calendar_data:
        try:
            with open('./assets/calendar.json', 'w', encoding='utf-8') as f:
                # ensure_ascii=False: 한글이 유니코드 이스케이프(\u...) 대신 정상적으로 저장되도록 합니다.
                # indent=4: JSON 파일 내용을 들여쓰기하여 가독성을 높입니다.
                json.dump(calendar_data, f, ensure_ascii=False, indent=4)
            print("\n==============================================")
            print(f"🎉 총 {len(calendar_data)}일의 일정을 'calendar.json'에 저장 완료했습니다.")
            print("==============================================")
        except Exception as e:
            print(f"🚨 JSON 파일 저장 중 오류 발생: {e}")