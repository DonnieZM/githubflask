from re import S
from bs4 import BeautifulSoup
from selenium import webdriver
import selenium
from selenium.webdriver.chrome import service
from selenium.webdriver.common.keys import Keys
from webdriver_manager import driver
from webdriver_manager import chrome
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import requests
import time
import pandas as pd


#url = "https://www.suburbia.com.mx/tienda/Su%C3%A9teres%20y%20Sudaderas/CAT_SB_3024"
s = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=s)
driver.maximize_window()
url = "https://www.elpalaciodehierro.com/"
driver.get(url)
time.sleep(3)
#agente = {"User-Agent":"Mozilla/5.0"}
#sitio = requests.get(url,headers= agente)

_elem=driver.find_element_by_class_name("b-quick_search-input")
_elem.clear()
_elem.send_keys("Suéteres hombre")
#soup = BeautifulSoup(sitio.content, 'html.parser')
#desc = soup.find_all('h5', class_ = "card-title a-card-description")
#print (desc)

_elem.send_keys(Keys.RETURN)
time.sleep(3)

_soup = BeautifulSoup(driver.page_source, 'html.parser')
_contenedores = _soup.find_all('div', class_='b-product')
print(len(_contenedores))
driver.close()
#print(_contenedores)
print(_soup)

_nombre= _soup.find_all('div', class_ ='b-product_tile-name')
     #_nombre= _sue.find_all('div', class_ ='b-product_tile-name', datapid_='41663691')
     #_nombre= _sue.find_all('div', class_ ='b-product_tile-name', datapid_='41920154')
_precio= _contenedores.find_all('span', class_ ='b-product_price-value')
_marca= _contenedores.find_all('div', class_='b-product_tile-brand')
print(_nombre)

# for _sue in _contenedores:
#     _nombre= _sue.find_all('div', class_ ='b-product_tile-name')
#     #_nombre= _sue.find_all('div', class_ ='b-product_tile-name', datapid_='41663691')
#     #_nombre= _sue.find_all('div', class_ ='b-product_tile-name', datapid_='41920154')
#     _precio= _sue.find_all('span', class_ ='b-product_price-value')
#     _marca= _sue.find_all('div', class_='b-product_tile-brand')
#     print(_nombre)

