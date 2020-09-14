/*==============================================================================
 * (C) Copyright 2020 John J Kauflin, All rights reserved. 
 *----------------------------------------------------------------------------
 * DESCRIPTION:  Configuration data and functions around the creation of
 *               a PDF file.  Depends on the following javascript library
 *                  jsPDF (https://github.com/MrRio/jsPDF)
 * 
 *----------------------------------------------------------------------------
 * Modification History
 * 2020-09-14 JJK 	Initial version 
 *============================================================================*/
var pdfModule = (function () {
    'use strict';

    //=================================================================================================================
    // Private variables for the Module
    var defaultOrientation = 'letter';
    var defaultFontSize = 11;
    var startLineY = 1.5;

    //=================================================================================================================
    // Module methods
    function init(inTitle,inOrientation) {
        var currSysDate = new Date();
        var tempOrientation = defaultOrientation;
        if (inOrientation !== 'undefined') {
            tempOrientation = inOrientation;
        }

        var pdfRec = {
            title: inTitle,
            orientation: tempOrientation,
            createTimestamp: currSysDate.toString().substr(0, 24),
            lineColIncrArray: [],
            pageCnt: 0,
            lineCnt: 0,
            lineY: startLineY,
            lineIncrement: 0.25,
            colIncrement: 1.5,
            maxLineChars: 95,
            fontSize: 11,
            header: true
        };

        // Create the PDF object
        pdfRec.pdf = new jsPDF('p', 'in', pdfRec.orientation);
        pdfRec.pdf.setProperties({
            title: pdfRec.title,
            subject: pdfRec.title,
            author: 'system',
            keywords: 'generated, javascript, web 2.0, ajax',
            creator: 'MEEE'
        });

        return pdfRec;
    }


    // function to format a Yearly dues statement and add to the PDF
    function formatYearlyDuesStatement(pdfRec, hoaRec, firstNotice) {
        var ownerRec = hoaRec.ownersList[0];
        pdfRec.maxLineChars = 95;


        pdfRec.lineColIncrArray = [-4.5];
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[config.getVal('hoaName')], null, 13, 0.5);
        pdfRec.lineColIncrArray = [4.5, -3.05];
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[pdfRec.title + " for Fiscal Year ", hoaRec.assessmentsList[0].FY], null, 12, 0.8);

        // hoa name and address for return label
        pdfRec.lineIncrement = 0.2;
        pdfRec.lineColIncrArray = [1.0];
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[config.getVal('hoaName')], null, 10, 1.0);
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[config.getVal('hoaAddress1')]);
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[config.getVal('hoaAddress2')]);

        pdfRec.lineIncrement = 0.21;
        pdfRec.lineColIncrArray = [4.5, 1.3];
        pdfRec = yearlyDuesStatementAddLine(pdfRec,["For the Period: ", 'Oct 1st, ' + noticeYear + ' thru Sept 30th, ' + hoaRec.assessmentsList[0].FY], null, 11, 1.1);
        pdfRec.lineColIncrArray = [-4.5, -1.3];
        pdfRec = yearlyDuesStatementAddLine(pdfRec,["Notice Date: ", noticeDate]);


        pdfRec.lineColIncrArray = [-4.5];
        //pdfRec = yearlyDuesStatementAddLine(pdfRec,['']);
        //pdfRec = yearlyDuesStatementAddLine(pdfRec,['    Contact Information:']);
        pdfRec.lineColIncrArray = [4.5];
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[ownerRec.Owner_Name1 + ' ' + ownerRec.Owner_Name2]);
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[hoaRec.Parcel_Location]);
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[hoaRec.Property_City + ', ' + hoaRec.Property_State + ' ' + hoaRec.Property_Zip]);
        pdfRec = yearlyDuesStatementAddLine(pdfRec,['Phone # ' + ownerRec.Owner_Phone]);
        pdfRec = yearlyDuesStatementAddLine(pdfRec, ['Email: ' + hoaRec.DuesEmailAddr]);
        pdfRec = yearlyDuesStatementAddLine(pdfRec, ['Email2: ' + ownerRec.EmailAddr2]);

        // Display the mailing address
        pdfRec.lineIncrement = 0.21;
        pdfRec.lineColIncrArray = [1.0];
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[displayAddress1], null, 11, 2.5);
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[displayAddress2]);
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[displayAddress3]);
        pdfRec = yearlyDuesStatementAddLine(pdfRec,[displayAddress4]);



        return pdfRec;
    } // End of function formatYearlyDuesStatement(hoaRec) {

    //Function to add a line to the Yearly Dues Statement PDF
    function yearlyDuesStatementAddLine(pdfRec, pdfLineArray, pdfLineHeaderArray, fontSize, lineYStart) {
        pdfRec.lineCnt++;
        var X = 0.0;
        // X (horizontal), Y (vertical)

        // Print header and graphic sections (at the start of each page)
        if (pdfRec.lineCnt == 1) {
            pdfRec.pageCnt++;

            // X (horizontal), Y (vertical)
            //pdfRec.pdf.setFontSize(9);
            //pdfRec.pdf.text(8.05, 0.3, pdfRec.pageCnt.toString());
            //pdfRec.pdf.addImage(config.getLogoImgData(), 'JPEG', 0.42, 0.9, 0.53, 0.53);

            // Tri-fold lines
            pdfRec.pdf.setLineWidth(0.01);
            pdfRec.pdf.line(X, 3.75, 8.5, 3.75);
            pdfRec.pdf.setLineWidth(0.02);
            var segmentLength = 0.2;
            pdfRec = _dottedLine(pdfRec, 0, 7.5, 8.5, 7.5, segmentLength)

            //pdfRec.pdf.rect(0.4, 4.0, 4.4, 2.6);
            // Lines for address corrections
            //pdfRec.pdf.line(1.7, 4.65, 4.5, 4.65);

            pdfRec.lineY = startLineY;
            pdfRec.fontSize = defaultFontSize;
        }

        if (fontSize != null && fontSize !== 'undefined') {
            pdfRec.fontSize = fontSize;
        }
        if (lineYStart != null && lineYStart !== 'undefined') {
            pdfRec.lineY = lineYStart;
        }

        pdfRec.pdf.setFontSize(pdfRec.fontSize);

        pdfRec.lineY += pdfRec.lineIncrement;
        pdfRec.pdf.setFontType("normal");

        return pdfRec;
    } // End of function yearlyDuesStatementAddLine(pdfLineArray,pdfLineHeaderArray) {

    //=================================================================================================================
    // This is what is exposed from this Module
    return {
        init,
        formatYearlyDuesStatement,
        yearlyDuesStatementAddLine
    };

})(); // var pdfModule = (function(){
