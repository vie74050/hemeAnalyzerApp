import "../helpers/string-exts";

type rangeOptions = {
  item?: string;
  allowedmin: number;
  allowedmax: number;
  criticalmin: number | null;
  criticalmax: number | null;
  unit: string;
};
type CBCGroup = {
  wbc: rangeOptions;
  rbc: rangeOptions;
  hgb: rangeOptions;
  hct: rangeOptions;
  mcv: rangeOptions;
  mch: rangeOptions;
  mchc: rangeOptions;
  plt: rangeOptions;
  rdwsd: rangeOptions;
  rdwcv: rangeOptions;
  mpv: rangeOptions;
  neut: rangeOptions;
  lymph: rangeOptions;
  mono: rangeOptions;
  eo: rangeOptions;
  baso: rangeOptions;
  neutp: rangeOptions;
  lymphp: rangeOptions;
  monop: rangeOptions;
  eop: rangeOptions;
  basop: rangeOptions;
  ig: rangeOptions;
  igp: rangeOptions;
  ret: rangeOptions;
  retp: rangeOptions;
};

type CBCGroups = {
  [key: string]: CBCGroup;
};

enum ageGroup {
  neonate = "neonate",
  child = "child",
  adult_f = "adult f",
  adult_m = "adult m",
}

/* converted data from the excel file to a json object 
  0 - 1 month, 1 month <16 years, adult female >=18, adult male >=18
*/
const DefaultCBC: CBCGroups = {
  "neonate": {
    wbc: {
      allowedmin: 9.0,
      allowedmax: 30.0,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    rbc: {
      allowedmin: 4.30,
      allowedmax: 6.10,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^12/L",
    },
    hgb: {
      allowedmin: 150.0,
      allowedmax: 240.0,
      criticalmin: 59.9,
      criticalmax: null,
      unit: "g/L",
    },
    hct: {
      allowedmin: 0.410,
      allowedmax: 0.730,
      criticalmin: null,
      criticalmax: null,
      unit: "L/L",
    },
    mcv: {
      allowedmin: 95.0,
      allowedmax: 121.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    mch: {
      allowedmin: 26.0,
      allowedmax: 34.0,
      criticalmin: null,
      criticalmax: null,
      unit: "pg",
    },
    mchc: {
      allowedmin: 320,
      allowedmax: 367,
      criticalmin: null,
      criticalmax: null,
      unit: "g/L",
    },
    plt: {
      allowedmin: 140,
      allowedmax: 350,
      criticalmin: 29.9,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    rdwsd: {
      item: "RDW-SD",
      allowedmin: 34.0,
      allowedmax: 65.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    rdwcv: {
      item: "RDW-CV",
      allowedmin: 0.0,
      allowedmax: 20.1,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    mpv: {
      allowedmin: 7.4,
      allowedmax: 11.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    neut: {
      item: "NEUT #",
      allowedmin: 2.00,
      allowedmax: 20.00,
      criticalmin: 0.49,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    lymph: {
      item: "LYMPH #",
      allowedmin: 2.00,
      allowedmax: 10.00,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    mono: {
      item: "MONO #",
      allowedmin: 0.50,
      allowedmax: 1.80,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    eo: {
      item: "EO #",
      allowedmin: 0.00,
      allowedmax: 0.60,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    baso: {
      item: "BASO #",
      allowedmin: 0.00,
      allowedmax: 0.50,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    neutp: {
      item: "NEUT %",
      allowedmin: 20.0,
      allowedmax: 70.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    lymphp: {
      item: "LYMPH %",
      allowedmin: 10.0,
      allowedmax: 60.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    monop: {
      item: "MONO %",
      allowedmin: 1.0,
      allowedmax: 11.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    eop: {
      item: "EO %",
      allowedmin: 0.0,
      allowedmax: 3.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    basop: {
      item: "BASO %",
      allowedmin: 0.0,
      allowedmax: 2.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    ig: {
      item: "IG",
      allowedmin: 0.00,
      allowedmax: 0.20,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    igp: {
      item: "IG %",
      allowedmin: 0.0,
      allowedmax: 0.5,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    ret: {
      item: "RET #",
      allowedmin: 30.0,
      allowedmax: 170.0,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    retp: {
      item: "RET %",
      allowedmin: 0.5,
      allowedmax: 6.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
  },
  "child": {
    wbc: {
      allowedmin: 5.0,
      allowedmax: 12.0,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    rbc: {
      allowedmin: 3.80,
      allowedmax: 5.20,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^12/L",
    },
    hgb: {
      allowedmin: 110.0,
      allowedmax: 145.0,
      criticalmin: 59.9,
      criticalmax: null,
      unit: "g/L",
    },
    hct: {
      allowedmin: 0.320,
      allowedmax: 0.420,
      criticalmin: null,
      criticalmax: null,
      unit: "L/L",
    },
    mcv: {
      allowedmin: 72.0,
      allowedmax: 92.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    mch: {
      allowedmin: 26.0,
      allowedmax: 34.0,
      criticalmin: null,
      criticalmax: null,
      unit: "pg",
    },
    mchc: {
      allowedmin: 320,
      allowedmax: 355,
      criticalmin: null,
      criticalmax: null,
      unit: "g/L",
    },
    plt: {
      allowedmin: 160,
      allowedmax: 440,
      criticalmin: 29.9,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    rdwsd: {
      item: "RDW-SD",
      allowedmin: 34.0,
      allowedmax: 65.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    rdwcv: {
      item: "RDW-CV",
      allowedmin: 0.0,
      allowedmax: 18.1,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    mpv: {
      allowedmin: 7.4,
      allowedmax: 11.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    neut: {
      item: "NEUT #",
      allowedmin: 2.00,
      allowedmax: 7.50,
      criticalmin: 0.49,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    lymph: {
      item: "LYMPH #",
      allowedmin: 3.50,
      allowedmax: 10.00,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    mono: {
      item: "MONO #",
      allowedmin: 0.00,
      allowedmax: 0.80,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    eo: {
      item: "EO #",
      allowedmin: 0.00,
      allowedmax: 0.60,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    baso: {
      item: "BASO #",
      allowedmin: 0.0,
      allowedmax: 0.20,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    neutp: {
      item: "NEUT %",
      allowedmin: 30.0,
      allowedmax: 70.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    lymphp: {
      item: "LYMPH %",
      allowedmin: 10.0,
      allowedmax: 60.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    monop: {
      item: "MONO %",
      allowedmin: 0.0,
      allowedmax: 11.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    eop: {
      item: "EO %",
      allowedmin: 0.0,
      allowedmax: 3.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    basop: {
      item: "BASO %",
      allowedmin: 0.0,
      allowedmax: 2.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    ig: {
      item: "IG",
      allowedmin: 0.00,
      allowedmax: 0.20,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    igp: {
      item: "IG %",
      allowedmin: 0.0,
      allowedmax: 0.5,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    ret: {
      item: "RET #",
      allowedmin: 30.0,
      allowedmax: 170.0,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    retp: {
      item: "RET %",
      allowedmin: 0.5,
      allowedmax: 6.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
  },
  "adult f": {
    wbc: {
      allowedmin: 4.0,
      allowedmax: 11.0,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    rbc: {
      allowedmin: 3.70,
      allowedmax: 5.00,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^12/L",
    },
    hgb: {
      allowedmin: 120.0,
      allowedmax: 150.0,
      criticalmin: 59.9,
      criticalmax: null,
      unit: "g/L",
    },
    hct: {
      allowedmin: 0.350,
      allowedmax: 0.450,
      criticalmin: null,
      criticalmax: null,
      unit: "L/L",
    },
    mcv: {
      allowedmin: 80.0,
      allowedmax: 100.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    mch: {
      allowedmin: 26.0,
      allowedmax: 34.0,
      criticalmin: null,
      criticalmax: null,
      unit: "pg",
    },
    mchc: {
      allowedmin: 320,
      allowedmax: 360,
      criticalmin: null,
      criticalmax: null,
      unit: "g/L",
    },
    plt: {
      allowedmin: 140,
      allowedmax: 450,
      criticalmin: 29.9,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    rdwsd: {
      item: "RDW-SD",
      allowedmin: 34.0,
      allowedmax: 65.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    rdwcv: {
      item: "RDW-CV",
      allowedmin: 11.0,
      allowedmax: 18.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    mpv: {
      allowedmin: 7.4,
      allowedmax: 11.00,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    neut: {
      item: "NEUT #",
      allowedmin: 1.70,
      allowedmax: 7.50,
      criticalmin: 0.49,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    lymph: {
      item: "LYMPH #",
      allowedmin: 1.00,
      allowedmax: 3.20,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    mono: {
      item: "MONO #",
      allowedmin: 0.10,
      allowedmax: 1.30,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    eo: {
      item: "EO #",
      allowedmin: 0.00,
      allowedmax: 0.30,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    baso: {
      item: "BASO #",
      allowedmin: 0.00,
      allowedmax: 0.20,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    neutp: {
      item: "NEUT %",
      allowedmin: 50.0,
      allowedmax: 70.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    lymphp: {
      item: "LYMPH %",
      allowedmin: 18.0,
      allowedmax: 42.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    monop: {
      item: "MONO %",
      allowedmin: 2.0,
      allowedmax: 11.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    eop: {
      item: "EO %",
      allowedmin: 1.0,
      allowedmax: 3.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    basop: {
      item: "BASO %",
      allowedmin: 0.0,
      allowedmax: 2.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    ig: {
      item: "IG",
      allowedmin: 0.00,
      allowedmax: 0.20,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    igp: {
      item: "IG %",
      allowedmin: 0.0,
      allowedmax: 0.5,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    ret: {
      item: "RET #",
      allowedmin: 29.0,
      allowedmax: 120.0,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    retp: {
      item: "RET %",
      allowedmin: 0.4,
      allowedmax: 4.8,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
  },
  "adult m": {
    wbc: {
      allowedmin: 4.0,
      allowedmax: 11.0,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    rbc: {
      allowedmin: 4.40,
      allowedmax: 5.80,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^12/L",
    },
    hgb: {
      allowedmin: 130.0,
      allowedmax: 170.0,
      criticalmin: 59.9,
      criticalmax: null,
      unit: "g/L",
    },
    hct: {
      allowedmin: 0.400,
      allowedmax: 0.530,
      criticalmin: null,
      criticalmax: null,
      unit: "L/L",
    },
    mcv: {
      allowedmin: 80.0,
      allowedmax: 100.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    mch: {
      allowedmin: 26.0,
      allowedmax: 34.0,
      criticalmin: null,
      criticalmax: null,
      unit: "pg",
    },
    mchc: {
      allowedmin: 320,
      allowedmax: 360,
      criticalmin: null,
      criticalmax: null,
      unit: "g/L",
    },
    plt: {
      allowedmin: 140,
      allowedmax: 450,
      criticalmin: 29.9,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    rdwsd: {
      item: "RDW-SD",
      allowedmin: 34.0,
      allowedmax: 65.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    rdwcv: {
      item: "RDW-CV",
      allowedmin: 11.0,
      allowedmax: 18.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    mpv: {
      allowedmin: 7.4,
      allowedmax: 11.0,
      criticalmin: null,
      criticalmax: null,
      unit: "fL",
    },
    neut: {
      item: "NEUT #",
      allowedmin: 1.70,
      allowedmax: 7.50,
      criticalmin: 0.49,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    lymph: {
      item: "LYMPH #",
      allowedmin: 1.00,
      allowedmax: 3.20,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    mono: {
      item: "MONO #",
      allowedmin: 0.10,
      allowedmax: 1.30,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    eo: {
      item: "EO #",
      allowedmin: 0.00,
      allowedmax: 0.30,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    baso: {
      item: "BASO #",
      allowedmin: 0.00,
      allowedmax: 0.20,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    neutp: {
      item: "NEUT %",
      allowedmin: 50.0,
      allowedmax: 70.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    lymphp: {
      item: "LYMPH %",
      allowedmin: 18.0,
      allowedmax: 42.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    monop: {
      item: "MONO %",
      allowedmin: 2.0,
      allowedmax: 11.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    eop: {
      item: "EO %",
      allowedmin: 1.0,
      allowedmax: 3.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    basop: {
      item: "BASO %",
      allowedmin: 0.0,
      allowedmax: 2.0,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    ig: {
      item: "IG",
      allowedmin: 0.00,
      allowedmax: 0.20,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    igp: {
      item: "IG %",
      allowedmin: 0.0,
      allowedmax: 0.5,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
    ret: {
      item: "RET #",
      allowedmin: 29.0,
      allowedmax: 120.0,
      criticalmin: null,
      criticalmax: null,
      unit: "x 10^9/L",
    },
    retp: {
      item: "RET %",
      allowedmin: 0.4,
      allowedmax: 4.8,
      criticalmin: null,
      criticalmax: null,
      unit: "%",
    },
  }
};

function parseAge(age_str: string): number {
  let age = age_str.replace('old', '');

  if (age.includes('day')) {
    return parseInt(age) / 365;
  }
  if (age.includes('week')) {
    return parseInt(age) / 52;
  }
  if (age.includes('month')) {
    return parseInt(age) / 12;
  }
  if (age.includes('year')) {
    return parseInt(age);
  }

  return parseInt(age);
}

function GetRangeDefaults(age_str: string, gender_str: string ='f'): CBCGroup {
  let age_yrs: number = parseAge(age_str);

  if (age_yrs < 1 / 12) {
    return DefaultCBC[ageGroup.neonate];

  } else if (age_yrs < 16) {
    return DefaultCBC[ageGroup.child];

  } else {
      
    if (gender_str == 'm') {
        return DefaultCBC[ageGroup.adult_m];
      }

      return DefaultCBC[ageGroup.adult_f];
  }

  console.error(`No reference data found for`, age_str, gender_str);
}

export { GetRangeDefaults, CBCGroup, CBCGroups };