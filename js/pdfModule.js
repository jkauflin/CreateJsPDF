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
    var disclaimerText = "I hereby waive any right to collect payment from the above-mentioned enrollee for the " +
        "aforementioned services for which payment has been denied by the above-referenced " +
        "health plan.  I understand that the signing of this waiver does not negate my right to " +
        "request further appeal under 42 CFR 422.600.";

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

    function createWOL(pdfRec, MedicaidId, EnrolleeName, ProviderName, BeginDOS, EndDOS, Signature, SignatureDate) {
        pdfRec.maxLineChars = 95;
        pdfRec.pdf.setLineWidth(0.013);
        var coordX = 0.0;
        var coordY = 0.0;

        pdfRec.lineColIncrArray = [-2.6];  // Where you want the column to start (Negative is used to indicate BOLD)
        pdfRec = addLine(pdfRec, ['WAIVER OF LIABILITY STATEMENT'], null, 12, 0.4);

        coordX = 5.8;
        pdfRec.lineColIncrArray = [coordX];  // Where you want the column to start
        coordY = 1.0;
        pdfRec = addLine(pdfRec, [MedicaidId], null, 10, coordY-0.1); // font, and how far down
        // startX, startY, endX, endY
        pdfRec.pdf.line(coordX, coordY, coordX + 1.5, coordY);
        pdfRec = addLine(pdfRec, ['Medicare/HIC Number'], null, 10, coordY+0.2); // font, and how far down

        coordX = 1.0;
        coordY = 1.5;

        pdfRec.lineColIncrArray = [coordX];
        pdfRec = addLine(pdfRec, [EnrolleeName], null, 10, coordY-0.1);
        pdfRec.pdf.line(coordX, coordY, coordX + 2.5, coordY);
        pdfRec = addLine(pdfRec, ["Enrollee's Name"], null, 10, coordY+0.2);

        coordY = coordY + 0.8;
        pdfRec = addLine(pdfRec, [ProviderName], null, 10, coordY - 0.1);
        pdfRec.pdf.line(coordX, coordY, coordX + 2.5, coordY);
        pdfRec = addLine(pdfRec, ["Provider"], null, 10, coordY + 0.2);

        coordY = coordY + 0.8;
        pdfRec = addLine(pdfRec, ['Caresource'], null, 10, coordY - 0.1);
        pdfRec.pdf.line(coordX, coordY, coordX + 2.5, coordY);
        pdfRec = addLine(pdfRec, ["Health Plan"], null, 10, coordY + 0.2);

        coordY = coordY + 0.8;
        pdfRec = addLine(pdfRec, [BeginDOS + ' to ' + EndDOS], null, 10, coordY - 0.1);
        pdfRec.pdf.line(coordX, coordY, coordX + 2.5, coordY);
        pdfRec = addLine(pdfRec, ["Dates of Service"], null, 10, coordY + 0.2);

        coordY = coordY + 0.7;
        pdfRec = addLine(pdfRec, [disclaimerText], null, 10, coordY);

        coordY = coordY + 1.4;
        pdfRec = addLine(pdfRec, [Signature], null, 10, coordY - 0.1);
        pdfRec.pdf.line(coordX, coordY, coordX + 2.5, coordY);
        pdfRec = addLine(pdfRec, ["Signature"], null, 10, coordY + 0.2);

        coordY = coordY + 0.8;
        pdfRec = addLine(pdfRec, [SignatureDate], null, 10, coordY - 0.1);
        pdfRec.pdf.line(coordX, coordY, coordX + 2.5, coordY);
        pdfRec = addLine(pdfRec, ["Date"], null, 10, coordY + 0.2);

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

            // Box around area
            //pdfRec.pdf.rect(0.4, 4.0, 4.4, 2.6);

            // Checkboxes for survey questions
            // empty square (X,Y, X length, Y length)
            //pdfRec.pdf.setLineWidth(0.015);
            //pdfRec.pdf.rect(0.5, 6.7, 0.2, 0.2);

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
        createWOL
    };

})(); // var pdfModule = (function(){
