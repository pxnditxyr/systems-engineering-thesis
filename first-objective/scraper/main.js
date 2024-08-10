import fs from 'fs'
import path from 'path'

async function fetchHTML(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.text();
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processLinks(links) {
    const folderPath = path.join(__dirname, 'datos-meteorologicos');

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    for (const link of links) {
        try {
            const html = await fetchHTML(link);
            const urlParts = link.split('/');
            const fileName = `${urlParts[urlParts.length - 1]}.html`;
            const filePath = path.join(folderPath, fileName);

            fs.writeFileSync(filePath, html, 'utf8');
            console.log(`Saved: ${filePath}`);
        } catch (error) {
            console.error('Error fetching HTML:', error);
        }
        await delay(10000); // Esperar 10 segundos antes de la siguiente solicitud
    }
}

function generateWeatherLinks(startDate, endDate) {
    const links = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const baseURL = `https://es.weatherspark.com/h/d/27348/${year}/${month}/${day}/Tiempo-hist%C3%B3rico-el-${currentDate.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase()}-${day}-de-${month}-${year}-en-La-Paz-Bolivia`;

        links.push(baseURL);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return links;
}

const startDate = new Date('1938-04-01');
// const endDate = new Date('2024-08-09');
const endDate = new Date('1938-04-30');
const weatherLinks = generateWeatherLinks(startDate, endDate);

processLinks(weatherLinks);
