function exec(){
    document.getElementById('loading').style.display = 'block';
getDataBase(setDataBase);
}

function getDataBase(callback){
    const input = document.getElementById('planilhaBase');
    const file = input.files[0];

    if (!file) {
        alert('Por favor, selecione ambas as planilhas.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.load(e.target.result).then(function(workbook){
            const worksheet = workbook.worksheets[0];

            const rows = [];


            for (let i = 1; i <= worksheet.rowCount; i++) {
                const row = worksheet.getRow(i);
            
                if(row.values[1] && !isNaN(row.values[1])){
                    rows.push(row.values);
                }
            }

            callback(rows);
        });
    }

    reader.readAsBinaryString(file);
}

function setDataBase(rowsBase){
    const input = document.getElementById('planilhaDesatualizada');
    const file = input.files[0];

    if (!file) {
        alert('Por favor, selecione ambas as planilhas.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e){
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.load(e.target.result).then(function(_workbook){
            const worksheet = _workbook.getWorksheet("Products");

            for (let i = 1; i <= worksheet.rowCount; i++) {

                const row = worksheet.getRow(i);
            
                const sku = row.getCell("D").value;

                if(sku){
                    const matchedRow = rowsBase.find((baseObject) => checkEquals(row.values, baseObject));

                    if(matchedRow){
                        row.getCell("K").value = matchedRow[7];
                        v = matchedRow[8].replace(".", "");
                        row.getCell("P").value = v.replace(",", ".");
                    }
                }
                document.getElementById('loading').style.display = 'none';
            }
            downloadFile(_workbook);
        });
    }

    reader.readAsBinaryString(file);
}

function checkEquals(targetData, baseData){
    try{
        const targetId = Number(targetData[4]);
        const baseId = Number(baseData[1]);
        return targetId === baseId;
    }catch(_){
        return false;
    }
}

function downloadFile(workbook){
workbook.xlsx.writeBuffer({
                useStyles: true,
                useSharedStrings: true
            }).then(function (data) {
    const blob = new Blob([data],{ type: 'application/xlsx' });
    saveAs(blob,"Planilha Atualizada.xlsx");
});
}