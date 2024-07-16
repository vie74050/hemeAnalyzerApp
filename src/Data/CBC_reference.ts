import "../helpers/string-exts";

type CBCData = {
  "Param": string,
  "AllowedMin": number | string,
  "AllowedMax": number | string,
  "CriticalMin": number | string,
  "CriticalMax": number | string,
  "Unit": string,
};

export type CBCDataArray = CBCData[];

// Enter data from SME -- see reference sample google sheet
  const peds0: CBCDataArray = [
    {
      "Param": "WBC",
      "AllowedMin": 9,
      "AllowedMax": 30,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "RBC",
      "AllowedMin": 4.3,
      "AllowedMax": 6.1,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^12/L"
    },
    {
      "Param": "HGB",
      "AllowedMin": 150,
      "AllowedMax": 240,
      "CriticalMin": 59.9,
      "CriticalMax": "",
      "Unit": "g/L"
    },
    {
      "Param": "HCT",
      "AllowedMin": 0.41,
      "AllowedMax": 0.73,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "L/L"
    },
    {
      "Param": "MCV",
      "AllowedMin": 95,
      "AllowedMax": 121,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "fL"
    },
    {
      "Param": "MCH",
      "AllowedMin": 26,
      "AllowedMax": 34,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "pg"
    },
    {
      "Param": "MCHC",
      "AllowedMin": 320,
      "AllowedMax": 367,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "g/L"
    },
    {
      "Param": "PLT",
      "AllowedMin": 140,
      "AllowedMax": 350,
      "CriticalMin": 29.9,
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "RDW-SD",
      "AllowedMin": 34,
      "AllowedMax": 65,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "fL"
    },
    {
      "Param": "RDW-CV",
      "AllowedMin": 0,
      "AllowedMax": 20.1,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "MPV",
      "AllowedMin": 7.4,
      "AllowedMax": 11,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "fL"
    },
    {
      "Param": "NEUT #",
      "AllowedMin": 2,
      "AllowedMax": 20,
      "CriticalMin": 0.49,
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "LYMPH #",
      "AllowedMin": 2,
      "AllowedMax": 10,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "MONO #",
      "AllowedMin": 0.5,
      "AllowedMax": 1.8,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "EO #",
      "AllowedMin": 0,
      "AllowedMax": 0.6,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "BASO #",
      "AllowedMin": 0,
      "AllowedMax": 0.5,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "NEUT %",
      "AllowedMin": 20,
      "AllowedMax": 70,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "LYMPH %",
      "AllowedMin": 10,
      "AllowedMax": 60,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "MONO %",
      "AllowedMin": 1,
      "AllowedMax": 11,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "EO %",
      "AllowedMin": 0,
      "AllowedMax": 3,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "BASO %",
      "AllowedMin": 0,
      "AllowedMax": 2,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "IG #",
      "AllowedMin": 0,
      "AllowedMax": 0.2,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "IG %",
      "AllowedMin": 0,
      "AllowedMax": 0.5,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "RET #",
      "AllowedMin": 30,
      "AllowedMax": 170,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "RET %",
      "AllowedMin": 0.5,
      "AllowedMax": 6,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    }
  ];
  
  const peds15: CBCDataArray = [
    {
      "Param": "WBC",
      "AllowedMin": 5,
      "AllowedMax": 12,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "RBC",
      "AllowedMin": 3.8,
      "AllowedMax": 5.2,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^12/L"
    },
    {
      "Param": "HGB",
      "AllowedMin": 110,
      "AllowedMax": 145,
      "CriticalMin": 59.9,
      "CriticalMax": "",
      "Unit": "g/L"
    },
    {
      "Param": "HCT",
      "AllowedMin": 0.32,
      "AllowedMax": 0.42,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "L/L"
    },
    {
      "Param": "MCV",
      "AllowedMin": 72,
      "AllowedMax": 92,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "fL"
    },
    {
      "Param": "MCH",
      "AllowedMin": 26,
      "AllowedMax": 34,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "pg"
    },
    {
      "Param": "MCHC",
      "AllowedMin": 320,
      "AllowedMax": 355,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "g/L"
    },
    {
      "Param": "PLT",
      "AllowedMin": 160,
      "AllowedMax": 440,
      "CriticalMin": 29.9,
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "RDW-SD",
      "AllowedMin": 34,
      "AllowedMax": 65,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "fL"
    },
    {
      "Param": "RDW-CV",
      "AllowedMin": 0,
      "AllowedMax": 18.1,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "MPV",
      "AllowedMin": 7.4,
      "AllowedMax": 11,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "fL"
    },
    {
      "Param": "NEUT #",
      "AllowedMin": 2,
      "AllowedMax": 7.5,
      "CriticalMin": 0.49,
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "LYMPH #",
      "AllowedMin": 3.5,
      "AllowedMax": 10,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "MONO #",
      "AllowedMin": 0,
      "AllowedMax": 0.8,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "EO #",
      "AllowedMin": 0,
      "AllowedMax": 0.6,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "BASO #",
      "AllowedMin": 0,
      "AllowedMax": 0.2,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "NEUT %",
      "AllowedMin": 30,
      "AllowedMax": 70,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "LYMPH %",
      "AllowedMin": 10,
      "AllowedMax": 60,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "MONO %",
      "AllowedMin": 0,
      "AllowedMax": 11,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "EO %",
      "AllowedMin": 0,
      "AllowedMax": 3,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "BASO %",
      "AllowedMin": 0,
      "AllowedMax": 2,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "IG #",
      "AllowedMin": 0,
      "AllowedMax": 0.2,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "IG %",
      "AllowedMin": 0,
      "AllowedMax": 0.5,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "RET #",
      "AllowedMin": 30,
      "AllowedMax": 170,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "RET %",
      "AllowedMin": 0.5,
      "AllowedMax": 6,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    }
  ];
  
  const f18: CBCDataArray = [
    {
      "Param": "WBC",
      "AllowedMin": 4,
      "AllowedMax": 11,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "RBC",
      "AllowedMin": 3.7,
      "AllowedMax": 5,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^12/L"
    },
    {
      "Param": "HGB",
      "AllowedMin": 120,
      "AllowedMax": 150,
      "CriticalMin": 59.9,
      "CriticalMax": "",
      "Unit": "g/L"
    },
    {
      "Param": "HCT",
      "AllowedMin": 0.35,
      "AllowedMax": 0.45,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "L/L"
    },
    {
      "Param": "MCV",
      "AllowedMin": 80,
      "AllowedMax": 100,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "fL"
    },
    {
      "Param": "MCH",
      "AllowedMin": 26,
      "AllowedMax": 34,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "pg"
    },
    {
      "Param": "MCHC",
      "AllowedMin": 320,
      "AllowedMax": 360,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "g/L"
    },
    {
      "Param": "PLT",
      "AllowedMin": 140,
      "AllowedMax": 450,
      "CriticalMin": 29.9,
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "RDW-SD",
      "AllowedMin": 34,
      "AllowedMax": 65,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "fL"
    },
    {
      "Param": "RDW-CV",
      "AllowedMin": 11,
      "AllowedMax": 18,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "MPV",
      "AllowedMin": 7.4,
      "AllowedMax": 11,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "fL"
    },
    {
      "Param": "NEUT #",
      "AllowedMin": 1.7,
      "AllowedMax": 7.5,
      "CriticalMin": 0.49,
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "LYMPH #",
      "AllowedMin": 1,
      "AllowedMax": 3.2,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "MONO #",
      "AllowedMin": 0.1,
      "AllowedMax": 1.3,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "EO #",
      "AllowedMin": 0,
      "AllowedMax": 0.3,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "BASO #",
      "AllowedMin": 0,
      "AllowedMax": 0.2,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "NEUT %",
      "AllowedMin": 50,
      "AllowedMax": 70,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "LYMPH %",
      "AllowedMin": 18,
      "AllowedMax": 42,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "MONO %",
      "AllowedMin": 2,
      "AllowedMax": 11,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "EO %",
      "AllowedMin": 1,
      "AllowedMax": 3,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "BASO %",
      "AllowedMin": 0,
      "AllowedMax": 2,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "IG #",
      "AllowedMin": 0,
      "AllowedMax": 0.2,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "IG %",
      "AllowedMin": 0,
      "AllowedMax": 0.5,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    },
    {
      "Param": "RET #",
      "AllowedMin": 29,
      "AllowedMax": 120,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "x 10^9/L"
    },
    {
      "Param": "RET %",
      "AllowedMin": 0.4,
      "AllowedMax": 4.8,
      "CriticalMin": "",
      "CriticalMax": "",
      "Unit": "%"
    }
  ];
  
  const m18: CBCDataArray = [
      {
        "Param": "WBC",
        "AllowedMin": 4,
        "AllowedMax": 11,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "x 10^9/L"
      },
      {
        "Param": "RBC",
        "AllowedMin": 4.4,
        "AllowedMax": 5.8,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "x 10^12/L"
      },
      {
        "Param": "HGB",
        "AllowedMin": 130,
        "AllowedMax": 170,
        "CriticalMin": 59.9,
        "CriticalMax": "",
        "Unit": "g/L"
      },
      {
        "Param": "HCT",
        "AllowedMin": 0.4,
        "AllowedMax": 0.53,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "L/L"
      },
      {
        "Param": "MCV",
        "AllowedMin": 80,
        "AllowedMax": 100,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "fL"
      },
      {
        "Param": "MCH",
        "AllowedMin": 26,
        "AllowedMax": 34,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "pg"
      },
      {
        "Param": "MCHC",
        "AllowedMin": 320,
        "AllowedMax": 360,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "g/L"
      },
      {
        "Param": "PLT",
        "AllowedMin": 140,
        "AllowedMax": 450,
        "CriticalMin": 29.9,
        "CriticalMax": "",
        "Unit": "x 10^9/L"
      },
      {
        "Param": "RDW-SD",
        "AllowedMin": 34,
        "AllowedMax": 65,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "fL"
      },
      {
        "Param": "RDW-CV",
        "AllowedMin": 11,
        "AllowedMax": 18,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "%"
      },
      {
        "Param": "MPV",
        "AllowedMin": 7.4,
        "AllowedMax": 11,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "fL"
      },
      {
        "Param": "NEUT #",
        "AllowedMin": 1.7,
        "AllowedMax": 7.5,
        "CriticalMin": 0.49,
        "CriticalMax": "",
        "Unit": "x 10^9/L"
      },
      {
        "Param": "LYMPH #",
        "AllowedMin": 1,
        "AllowedMax": 3.2,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "x 10^9/L"
      },
      {
        "Param": "MONO #",
        "AllowedMin": 0.1,
        "AllowedMax": 1.3,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "x 10^9/L"
      },
      {
        "Param": "EO #",
        "AllowedMin": 0,
        "AllowedMax": 0.3,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "x 10^9/L"
      },
      {
        "Param": "BASO #",
        "AllowedMin": 0,
        "AllowedMax": 0.2,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "x 10^9/L"
      },
      {
        "Param": "NEUT %",
        "AllowedMin": 50,
        "AllowedMax": 70,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "%"
      },
      {
        "Param": "LYMPH %",
        "AllowedMin": 18,
        "AllowedMax": 42,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "%"
      },
      {
        "Param": "MONO %",
        "AllowedMin": 2,
        "AllowedMax": 11,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "%"
      },
      {
        "Param": "EO %",
        "AllowedMin": 1,
        "AllowedMax": 3,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "%"
      },
      {
        "Param": "BASO %",
        "AllowedMin": 0,
        "AllowedMax": 2,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "%"
      },
      {
        "Param": "IG #",
        "AllowedMin": 0,
        "AllowedMax": 0.2,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "x 10^9/L"
      },
      {
        "Param": "IG %",
        "AllowedMin": 0,
        "AllowedMax": 0.5,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "%"
      },
      {
        "Param": "RET #",
        "AllowedMin": 29,
        "AllowedMax": 120,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "x 10^9/L"
      },
      {
        "Param": "RET %",
        "AllowedMin": 0.4,
        "AllowedMax": 4.8,
        "CriticalMin": "",
        "CriticalMax": "",
        "Unit": "%"
      }
  ]
  
 // Function to look up CBC data based on age, and gender if adult (>18y.o) 
export function LookUpCBCData(age: string, gender: string ='f'): CBCDataArray{
  let age_yrs = parseAge(age); 

  if (age_yrs < 1/12) { // 1 month old or younger
    return peds0;
  } else if (age_yrs < 16) {
    return peds15;
  } else {
    
    if (gender === 'm') {
      return m18;
    }

    return f18;
  }

  console.error(`No reference data found for`, age, gender);
}; 

function parseAge(age_str: string){
  let age = age_str.replace('old', '');

  if(age.includes('day')){
      return parseInt(age) / 365;
  }
  if(age.includes('week')){
      return parseInt(age) / 52;
  }
  if(age.includes('month')){
      return parseInt(age) / 12;
  }
  if(age.includes('year')){
      return parseInt(age);
  }
      
  return parseInt(this);
}