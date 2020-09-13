/*==============================================================================
 * (C) Copyright 2020 John J Kauflin, All rights reserved. 
 *----------------------------------------------------------------------------
 * DESCRIPTION: 
 *----------------------------------------------------------------------------
 * Modification History
 * 2020-09-13 JJK 	Initial version 
*============================================================================*/
var main = (function () {
    'use strict';  // Force declaration of variables before use (among other things)

    //=================================================================================================================
    // Private variables for the Module

    //=================================================================================================================
    // Variables cached from the DOM
    var $document = $(document);
    //var $CreatePDF = $("#CreatePDF");
    var $BeginDOS = $("#BeginDOS");
    var $EndDOS = $("#EndDOS");
    var $EnrolleeName = $("#EnrolleeName");
    var $ProviderName = $("#ProviderName");
    var $MedicaidId = $("#MedicaidId");
    var $Signature = $("#Signature");
    var $SignatureDate = $("#SignatureDate");

    //=================================================================================================================
    // Bind events
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

    }


    function _duesEmailsSend() {
        var commType = 'Dues Notice Email';
        var commDesc = '';
        var firstNotice = true
        var noticeType = "1st";
        var pdfRec;
        var hoaRec = null;
        var testEmailAddr = config.getVal('duesEmailTestAddress');
        var parcelId = event.target.getAttribute("data-parcelId");
        var emailAddr = event.target.getAttribute("data-emailAddr");

        $.getJSON("getHoaDbData.php", "parcelId=" + parcelId, function (outHoaRec) {
            hoaRec = outHoaRec;
            console.log("Email send, ParcelId = " + hoaRec.Parcel_ID + ", email = " + emailAddr + ", Owner = " + hoaRec.ownersList[0].Owner_Name1);

            // Create a pdfRec and initialize the PDF object
            pdfRec = pdfModule.init('Member Dues Notice');
            // Call function to format the yearly dues statement for an individual property
            pdfRec = pdfModule.formatYearlyDuesStatement(pdfRec, hoaRec, firstNotice);

            $.post("sendMail.php", {
                toEmail: emailAddr,
                subject: config.getVal('hoaNameShort') + ' Dues Notice',
                messageStr: 'Attached is the ' + config.getVal('hoaName') + ' Dues Notice.  *** Reply to this email to request unsubscribe ***',
                parcelId: hoaRec.Parcel_ID,
                ownerId: hoaRec.ownersList[0].OwnerID,
                filename: config.getVal('hoaNameShort') + 'DuesNotice.pdf',
                filedata: btoa(pdfRec.pdf.output())
            }, function (response) {
                console.log("result from sendMail = " + response.result + ", ParcelId = " + response.Parcel_ID + ", OwnerId = " + response.OwnerID + ", response.sendEmailAddr = " + response.sendEmailAddr);
                if (response.result == 'SUCCESS') {
                    commDesc = noticeType + " Dues Notice emailed to " + response.sendEmailAddr;
                    // log communication for notice created
                    communications.LogCommunication(response.Parcel_ID, response.OwnerID, commType, commDesc);
                } else {
                    commDesc = noticeType + " Dues Notice, ERROR emailing to " + response.sendEmailAddr;
                    //util.displayError(commDesc + ", ParcelId = " + response.Parcel_ID + ", OwnerId = " + response.OwnerID);
                    console.log("Error sending Email, ParcelId = " + response.Parcel_ID + ", OwnerId = " + response.OwnerID + ", sendEmailAddr = " + response.sendEmailAddr + ", message = " + response.message);
                }
            }, 'json'); // End of $.post("sendMail.php"
        });

    }

    //=================================================================================================================
    // This is what is exposed from this Module
    return {
    };

})(); // var main = (function(){
