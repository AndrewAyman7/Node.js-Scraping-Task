/*
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

function cleanJsonString(jsonString) {
  let cleanedString = jsonString.replace(/[\n\r\t]/g, ' ');

  cleanedString = cleanedString.replace(/,\s*([}\]])/g, '$1');

  cleanedString = cleanedString.trim();

  const parsedJson = JSON.parse(cleanedString);
  return JSON.stringify(parsedJson, null, 2);
}

async function fetchCarData(page) {
  const url = `https://www.theparking-cars.com/used-cars/mercedes.html#!/used-cars/mercedes.html%3Fid_modele%3D490%26id_version%3D250&page=${page}`;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const carData = [];

    $('script[type="application/ld+json"]').each((i, script) => {
      const scriptContent = $(script).html();
      const cleanedScriptContent = cleanJsonString(scriptContent);
      const data = JSON.parse(cleanedScriptContent);
      carData.push(data);
    });

    return carData;
  } catch (error) {
    console.error(`Error fetching data for page ${page}:`, error);
    return null;
  }
}

async function main() {
  const carData = [];
  for (let page = 1; page <= 2; page++) {
    const data = await fetchCarData(page);
    if (data) {
      carData.push(...data);
    }
  }

  fs.writeFile('cars.json', JSON.stringify(carData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data successfully written to cars.json');
    }
  });
}

main();
*/

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchCarData(page) {
  const url = `https://www.theparking-cars.com/used-cars/mercedes.html#!/used-cars/mercedes.html%3Fid_modele%3D490%26id_version%3D250&page=${page}`;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const cars = [];

    $('.li-result').each((index, element) => {

      const car = {
        title: $(element).find('.block-title-list h2 a .title-block.brand').text().trim(),
        model: $(element).find('.block-title-list h2 a .sub-title.title-block').first().text().trim(),
        variant: $(element).find('.block-title-list h2 a .sub-title.title-block .nowrap').map((i, el) => $(el).text().trim()).get().join(' '),
        price: $(element).find('.price-block .prix').first().text().trim(),
        description: $(element).find('.desc').text().trim(),
        location: $(element).find('.loc-date .location .upper').text().trim(),
        date: $(element).find('.loc-date .btn-publication').text().trim(),
        fuelType: $(element).find('.info li').eq(0).find('.upper').text().trim() || '-',
        mileage: $(element).find('.info li').eq(1).find('.upper').text().trim(),
        productionYear: $(element).find('.info li').eq(2).find('.upper').text().trim(),
        transmission: $(element).find('.info li').eq(3).find('.upper').text().trim(),
        postalCode: $(element).find('.info li').eq(4).find('.upper').text().trim(),
        image: $(element).find('picture source').attr('srcset') || $(element).find('picture img').attr('src')
      };

      cars.push(car);
    });

    return cars;
  } catch (error) {
    console.error("Error in fetching the data", error);
    return [];
  }
}

async function main() {
  const carData = [];

  for (let page = 1; page <= 2; page++) {
    const data = await fetchCarData(page);
    if (data) {
      carData.push(...data);
    }
  }

  if (carData.length > 0 && !carData[0].title) {
    carData.shift();
  }

  fs.writeFile('cars.json', JSON.stringify(carData, null, 2), (err) => {
    if (err) {
      console.error('Error in writing to the json file:', err);
    } else {
      console.log('Data successfully Added into cars.json');
    }
  });
}

main();
