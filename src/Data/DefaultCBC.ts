/* convert the data from the excel file to a json object 
Param	AllowedMin	AllowedMax	CriticalMin	CriticalMax	Unit
WBC	9.0	30.0			x 10^9/L
RBC	4.30	6.10			x 10^12/L
HGB	150.0	240.0	59.9		g/L
HCT	0.410	0.730			L/L
MCV	95.0	121.0			fL
MCH	26.0	34.0			pg
MCHC	320	367			g/L
PLT	140	350	29.9		x 10^9/L
RDW-SD	34.0	65.0			fL
RDW-CV	0.0	20.1			%
MPV	7.4	11.0			fL
NEUT #	2.00	20.00	0.49		x 10^9/L
LYMPH #	2.00	10.00			x 10^9/L
MONO #	0.50	1.80			x 10^9/L
EO #	0.00	0.60			x 10^9/L
BASO #	0.00	0.50			x 10^9/L
NEUT %	20.0	70.0			%
LYMPH %	10.0	60.0			%
MONO %	1.0	11.0			%
EO %	0.0	3.0			%
BASO %	0.0	2.0			%
IG #	0.00	0.20			x 10^9/L
IG %	0.0	0.5			%
RET #	30.0	170.0			x 10^9/L
RET %	0.5	6.0			%
*/
export const neonate = {
  "WBC": {
    AllowedMin: 9.0,
    AllowedMax: 30.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "x 10^9/L",
  },
  "RBC": {
    AllowedMin: 4.30,
    AllowedMax: 6.10,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "x 10^12/L",
  },
  "HGB": {
    AllowedMin: 150.0,
    AllowedMax: 240.0,
    CriticalMin: 59.9,
    CriticalMax: null,
    Unit: "g/L",
  },
  "HCT": {
    AllowedMin: 0.410,
    AllowedMax: 0.730,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "L/L",
  },
  "MCV": {
    AllowedMin: 95.0,
    AllowedMax: 121.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "fL",
  },
  "MCH": {
    AllowedMin: 26.0,
    AllowedMax: 34.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "pg",
  },
  "MCHC": {
    AllowedMin: 320,
    AllowedMax: 367,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "g/L",
  },
  "PLT": {
    AllowedMin: 140,
    AllowedMax: 350,
    CriticalMin: 29.9,
    CriticalMax: null,
    Unit: "x 10^9/L",
  },
  "RDW-SD": {
    AllowedMin: 34.0,
    AllowedMax: 65.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "fL",
  },
  "RDW-CV": {
    AllowedMin: 0.0,
    AllowedMax: 20.1,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "%",
  },
  "MPV": {
    AllowedMin: 7.4,
    AllowedMax: 11.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "fL",
  },
  "NEUT": {
    AllowedMin: 2.00,
    AllowedMax: 20.00,
    CriticalMin: 0.49,
    CriticalMax: null,
    Unit: "x 10^9/L",
  },
  "LYMPH": {
    AllowedMin: 2.00,
    AllowedMax: 10.00,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "x 10^9/L",
  },
  "MONO": {
    AllowedMin: 0.50,
    AllowedMax: 1.80,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "x 10^9/L",
  },
  "EO": {
    AllowedMin: 0.00,
    AllowedMax: 0.60,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "x 10^9/L",
  },
  "BASO": {
    AllowedMin: 0.00,
    AllowedMax: 0.50,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "x 10^9/L",
  },
  "NEUT %": {
    AllowedMin: 20.0,
    AllowedMax: 70.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "%",
  },
  "LYMPH %": {
    AllowedMin: 10.0,
    AllowedMax: 60.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "%",
  },
  "MONO %": {
    AllowedMin: 1.0,
    AllowedMax: 11.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "%",
  },
  "EO %": {
    AllowedMin: 0.0,
    AllowedMax: 3.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "%",
  },
  "BASO %": {
    AllowedMin: 0.0,
    AllowedMax: 2.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "%",
  },
  "IG": {
    AllowedMin: 0.00,
    AllowedMax: 0.20,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "x 10^9/L",
  },
  "IG %": {
    AllowedMin: 0.0,
    AllowedMax: 0.5,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "%",
  },
  "RET": {
    AllowedMin: 30.0,
    AllowedMax: 170.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "x 10^9/L",
  },
  "RET %": {
    AllowedMin: 0.5,
    AllowedMax: 6.0,
    CriticalMin: null,
    CriticalMax: null,
    Unit: "%",
  },
};
