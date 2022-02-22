import * as XLSX from "xlsx";

export const redundantFactors = [
    'SUB-INDICATORS',
    'Final Scaling',
    'lower reference value rule',
    'upper refference value rule',
    'Normalization factor',
    'min',
    'max',
    'Q1',
    'Q3',
    'IQR',
    'lower reference value',
    'upper refference value',
    'upper reference value',
    'normalization factor',
    'Skewness',
    'Remove?',
    'weight',
    'Data gaps per indicator',
];

export const countries = [
    "Argentina",
    "Australia",
    "Austria",
    "Belgium",
    "Bangladesh",
    "Bhutan",
    "Brazil",
    "Canada",
    "Switzerland",
    "Chile",
    "China",
    "Democratic Republic of the Congo",
    "Colombia",
    "Cape Verde",
    "Costa Rica",
    "Cyprus",
    "Germany",
    "Denmark",
    "Dominican Republic",
    "Algeria",
    "Ecuador",
    "Spain",
    "Finland",
    "Fiji",
    "France",
    "United Kingdom",
    "Ghana",
    "Guinea",
    "Greece",
    "Guyana",
    "Hong Kong SAR, China",
    "Croatia",
    "Indonesia",
    "India",
    "Iceland",
    "Italy",
    "Jamaica",
    "Japan",
    "Kenya",
    "Republic of Korea",
    "Lebanon",
    "Mexico",
    "Mali",
    "Malta",
    "Myanmar",
    "Mozambique",
    "Mauritius",
    "Malaysia",
    "Namibia",
    "Niger",
    "Nigeria",
    "Netherlands",
    "Norway",
    "New Zealand",
    "Pakistan",
    "Panama",
    "Peru",
    "Philippines",
    "Papua New Guinea",
    "Poland",
    "Portugal",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Saudi Arabia",
    "Sudan",
    "Senegal",
    "Singapore",
    "Serbia",
    "Suriname",
    "Slovenia",
    "Sweden",
    "Chad",
    "Togo",
    "Tajikistan",
    "Turkey",
    "Uruguay",
    "United States",
    "Vietnam",
    "Republic of Yemen",
    "Zambia",
    "Zimbabwe"
];

export const readExcel = async (file) => {
    const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
            const Data = {};
            const bufferArray = e.target.result;

            const wb = XLSX.read(bufferArray, { type: "buffer" });
            const listofeconomysheet = wb.SheetNames[10];
            const listofeconomy = wb.Sheets[listofeconomysheet];
            Data.LOE = XLSX.utils.sheet_to_json(listofeconomy, {
                blankrows: false,
                range: 4,
            });

            const normalizationsheet = wb.SheetNames[3];
            const normalization = wb.Sheets[normalizationsheet];
            Data.Normalize = XLSX.utils.sheet_to_json(normalization, {
                range: 3,
            });
            resolve(Data);
        }
    });

    try {
        return await promise;
    } catch (error) {
        console.error(error);
    }
};

const getFilteredNormalizedData = (toFilterData, levels) => {
    const redundantWords = new Set(redundantFactors);
    const [levelOne, levelTwo, levelThree, levelFour] = levels;

    const levelMap = [];
    toFilterData.Normalize.forEach((normalizedData) => {
        const newNormalizedData = Object.entries(normalizedData).filter((measure) => (!redundantWords.has(measure[0])) && measure);
        const mapData = new Map(newNormalizedData);
        const onlyLevelOneAndTwo = (
            ((levelOne) && mapData.get('LVL') === 1) ||
                ((levelTwo) && mapData.get('LVL') === 2) ||
                ((levelThree) && mapData.get('LVL') === 3) ||
                ((levelFour) && mapData.get('LVL') === 4)
                ? mapData : null);
        if (onlyLevelOneAndTwo) levelMap.push(onlyLevelOneAndTwo);
    });
    return levelMap;
}

const getFilteredData = (toFilterData, filter) => {
    // "income_group": obj['Income group']
    return toFilterData.LOE.filter((object) => {
        return countries.some((country) => {
            return country === object.Economy;
        });
    }).map(obj => ({ "country": obj.Economy, "region": obj[filter], "code": obj.Code }));
}

export const getRegionWiseData = (data) => {
    const filteredNormalize = getFilteredNormalizedData(data, [1]);
    const filteredRegionWiseData = getFilteredData(data, 'Region');

    // code here
    console.log(filteredNormalize, filteredRegionWiseData);
    return data;
}
