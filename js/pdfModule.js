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

    function createWOL(pdfRec, MedicaidId, EnrolleeName, ProviderName) {
        pdfRec.maxLineChars = 95;
        pdfRec.pdf.setLineWidth(0.013);
        var coordX = 0.0;
        var coordY = 0.0;

        // Negative is used to indicate BOLD
        pdfRec.lineColIncrArray = [-2.5];  // Where you want the column to start
        pdfRec = addLine(pdfRec, ['WAIVER OF LIABILITY STATEMENT'], null, 12, 0.4);

        coordX = 5.8;
        pdfRec.lineColIncrArray = [coordX];  // Where you want the column to start
        coordY = 1.0;
        pdfRec = addLine(pdfRec, [MedicaidId], null, 10, coordY-0.1); // font, and how far down
        // startX, startY, endX, endY
        //pdfRec.pdf.line(5.8, 1.0, 7.2, 1.0);
        pdfRec.pdf.line(coordX, coordY, coordX + 1.5, coordY);
        pdfRec = addLine(pdfRec, ['Medicare/HIC Number'], null, 10, coordY+0.2); // font, and how far down

        coordX = 1.0;
        coordY = 1.5;

        pdfRec.lineColIncrArray = [coordX];  // Where you want the column to start
        pdfRec = addLine(pdfRec, [EnrolleeName], null, 10, coordY-0.1); // font, and how far down
        // startX, startY, endX, endY
        pdfRec.pdf.line(coordX, coordY, coordX + 2.5, coordY);
        pdfRec = addLine(pdfRec, ["Enrollee's Name"], null, 10, coordY+0.2); // font, and how far down

        pdfRec.lineColIncrArray = [coordX];  // Where you want the column to start
        coordY = coordY + 0.8;
        pdfRec = addLine(pdfRec, [ProviderName], null, 10, coordY - 0.1); // font, and how far down
        // startX, startY, endX, endY
        pdfRec.pdf.line(coordX, coordY, coordX + 2.5, coordY);
        pdfRec = addLine(pdfRec, ["Provider"], null, 10, coordY + 0.2); // font, and how far down
        

        return pdfRec;
    }

    //Function to add a line to the Yearly Dues Statement PDF
    function addLine(pdfRec, pdfLineArray, pdfLineHeaderArray, fontSize, lineYStart) {
        pdfRec.lineCnt++;
        var X = 0.0;
        // X (horizontal), Y (vertical)

        // Print header and graphic sections (at the start of each page)
        if (pdfRec.lineCnt == 1) {
            pdfRec.pageCnt++;

            // X (horizontal), Y (vertical)

            // Information correction area
            /*
            pdfRec.pdf.setLineWidth(0.013);
            // Box around area
            //pdfRec.pdf.rect(0.4, 4.0, 4.4, 2.0);   Not including the email line
            pdfRec.pdf.rect(0.4, 4.0, 4.4, 2.6);
            // Lines for address corrections
            pdfRec.pdf.line(1.7, 4.95, 4.5, 4.95);
            pdfRec.pdf.line(1.7, 5.25, 4.5, 5.25);
            pdfRec.pdf.line(1.7, 5.55, 4.5, 5.55);
            pdfRec.pdf.line(1.7, 5.85, 4.5, 5.85);

            // Checkboxes for survey questions
            // empty square (X,Y, X length, Y length)
            pdfRec.pdf.setLineWidth(0.015);
            //pdfRec.pdf.rect(0.5, 6.4, 0.2, 0.2); 
            pdfRec.pdf.rect(0.5, 6.7, 0.2, 0.2);
            //pdfRec.pdf.rect(0.5, 7.0, 0.2, 0.2); 
            */

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

        if (pdfLineHeaderArray != null && pdfLineHeaderArray !== 'undefined') {
            X = 0.0;
            // Loop through all the column headers in the array
            for (i = 0; i < pdfLineArray.length; i++) {
                if (pdfRec.lineColIncrArray[i] < 0) {
                    pdfRec.pdf.setFontType("bold");
                } else {
                    pdfRec.pdf.setFontType("normal");
                }
                X += Math.abs(pdfRec.lineColIncrArray[i]);
                pdfRec.pdf.text(X, pdfRec.lineY, '' + pdfLineHeaderArray[i]);
            }
            pdfRec.lineY += pdfRec.lineIncrement / 2.0;

            X = pdfRec.lineColIncrArray[0];
            pdfRec.pdf.setLineWidth(0.015);
            pdfRec.pdf.line(X, pdfRec.lineY, 8, pdfRec.lineY);
            pdfRec.lineY += pdfRec.lineIncrement;
        }

        var textLine = '';
        var breakPos = 0;
        var i = 0;
        var j = 0;
        X = 0.0;
        // Loop through all the columns in the array
        for (i = 0; i < pdfLineArray.length; i++) {
            if (pdfRec.lineColIncrArray[i] < 0) {
                pdfRec.pdf.setFontType("bold");
            } else {
                pdfRec.pdf.setFontType("normal");
            }

            X += Math.abs(pdfRec.lineColIncrArray[i]);
            textLine = '' + pdfLineArray[i];

            while (textLine.length > 0) {
                if (textLine.length > pdfRec.maxLineChars) {
                    breakPos = pdfRec.maxLineChars;
                    j = breakPos;
                    for (j; j > 0; j--) {
                        if (textLine[j] == ' ') {
                            breakPos = j;
                            break;
                        }
                    }

                    pdfRec.pdf.text(X, pdfRec.lineY, textLine.substr(0, breakPos));
                    pdfRec.lineY += pdfRec.lineIncrement;
                    textLine = textLine.substr(breakPos, textLine.length - breakPos);

                } else {
                    pdfRec.pdf.text(X, pdfRec.lineY, textLine);
                    textLine = '';
                }
            } // while (textLine.length > 0) {

        } // for (i = 0; i < pdfLineArray.length; i++) {
        pdfRec.lineY += pdfRec.lineIncrement;
        pdfRec.pdf.setFontType("normal");

        return pdfRec;
    }

    //=================================================================================================================
    // This is what is exposed from this Module
    return {
        init,
        createWOL,
        addLine
    };

})(); // var pdfModule = (function(){
