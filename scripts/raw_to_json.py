"""
A small hacky script that compiles the raw data into a json file.
"""
import glob
import pandas as pd
import os
import json


def main():
    json_data = []
    files = glob.glob("./raw/*.xls")
    SHEET_NAME = "Sheet"
    for file in files:
        print(f"Processing {file}")
        year = os.path.basename(file)[-8:-4]
        df = pd.read_excel(file, sheet_name=SHEET_NAME, skiprows=4, skipfooter=1)
        df["msh_year"] = year
        # remove any columns with the text "unnamed" in them
        df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
        # replace any NaN with ""
        df = df.fillna("")
        for _, row in df.iterrows():
            json_data.append(row.to_dict())

    with open("./msh_price_guide.json", "w") as f:
        json.dump(json_data, f, indent=4)

if __name__ == "__main__":
    main()