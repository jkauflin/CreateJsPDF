/*==============================================================================
 * (C) Copyright 2020 John J Kauflin, All rights reserved. 
 *----------------------------------------------------------------------------
 * DESCRIPTION:  Test create of a PDF using jsPDF library
 *----------------------------------------------------------------------------
 * Modification History
 * 2020-09-13 JJK 	Initial version 
*============================================================================*/
var main = (function () {
    'use strict';  // Force declaration of variables before use (among other things)

    var pdfRec;

    var $document = $(document);
    var $BeginDOS = $("#BeginDOS");
    var $EndDOS = $("#EndDOS");
    var $EnrolleeName = $("#EnrolleeName");
    var $ProviderName = $("#ProviderName");
    var $MedicaidId = $("#MedicaidId");
    var $Signature = $("#Signature");
    var $SignatureDate = $("#SignatureDate");

    $document.on("click", "#CreatePDF", _createPDF);

    //=================================================================================================================
    // Module methods
    function _createPDF(event) {
        console.log("in _createPDF");
        console.log("BeginDOS = " + $BeginDOS.val());
        console.log("EndDOS = " + $EndDOS.val());
        console.log("EnrolleeName = " + $EnrolleeName.val());
        console.log("ProviderName = " + $ProviderName.val());
        console.log("MedicaidId = " + $MedicaidId.val());
        console.log("Signature = " + $Signature.val());
        console.log("SignatureDate = " + $SignatureDate.val());

        // Create a pdfRec and initialize the PDF object
        pdfRec = pdfModule.init('Waiver of Liability');

        // function to add template formatting

        // function to add variables

        // Call function to format the yearly dues statement for an individual property
        //pdfRec = pdfModule.formatYearlyDuesStatement(pdfRec, hoaRec, firstNotice);
        pdfRec = pdfModule.createWOL(pdfRec, $MedicaidId.val(), $EnrolleeName.val(), $ProviderName.val());

        //filedata: btoa(pdfRec.pdf.output())
        // Just download the PDF for the test
        pdfRec.pdf.save("WOL.pdf");
    }

    //=================================================================================================================
    // This is what is exposed from this Module
    return {
    };

})(); // var main = (function(){
