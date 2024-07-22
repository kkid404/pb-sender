const Papa = require('papaparse');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const txtFilePath = path.join(__dirname, '.txt');

const status = ''
const url = ``

// Функция для чтения CSV файла
function readCSV(filePath, param) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject('Ошибка чтения файла: ' + err);
                return;
            }

            // Парсим данные с помощью papaparse
            Papa.parse(data, {
                header: true,
                dynamicTyping: true,
                complete: function(results) {
                    const ids = results.data.map(item => item[param]);
                    resolve(ids);
                }
            });
        });
    });
}

// Функция для чтения TXT файла
function readTXT(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject('Ошибка чтения файла: ' + err);
                return;
            }

            // Разделение данных на строки и создание объектов
            const lines = data.split('\n');
            const rows = lines.slice(0);
            
            const result = rows.map(row => {
                const values = row.split('\t');
                return values.map(value => value.trim());
            });
            
            // Преобразование в один плоский массив
            const ids = result.flat();
            
            resolve(ids);
        });
    });
}

// Обработка данных и отправка запросов
async function processParsedData(ids) {
    for (const subid of ids) {
        setTimeout(async () => {
            try {
                const response2 = await axios.get(
                    `${url}?subid=${subid}&status=${status}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log(`${subid} успешно отправлен`);
            } catch (e) {
                console.log(e);
            }
        }, 2000);
    }
}

const subids = readTXT(txtFilePath)
.then((data) => {
    processParsedData(data)
})
.catch((e) => console.log(e))
