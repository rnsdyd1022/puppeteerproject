const addOrderToEmailList = (newOrderList, emailList) => {
    var vendorToCheck = [];
    for (order of newOrderList) {

        let isInEmailList = false;

        let vdCode = order.STYLENUM.split("-")[0];

        for (vendor of emailList) {
            if (vendor.text == undefined) {
                vendor.text = "\n";
                vendor.html = "";
            }
            if (vendor.CODE == vdCode) {
                vendor.text =
                    vendor.text +
                    order.STYLENUM +
                    "\t" +
                    order.BOXNUM +
                    "\t" +
                    order.COLOR +
                    "\t" +
                    order.QTY +
                    "\n";
                vendor.html =
                    vendor.html +
                    "<tr><td nowrap>" +
                    order.STYLENUM +
                    "</td>" +
                    "<td nowrap>" +
                    order.BOXNUM +
                    "</td>" +
                    "<td nowrap>" +
                    order.COLOR +
                    "</td>" +
                    "<td nowrap>" +
                    order.QTY +
                    "</td>" +
                    "</tr>";
                isInEmailList = true;
            }
        }
        if (!isInEmailList && vdCode !== previousVd) {
            vendorToCheck.push(vdCode);
        }
        previousVd = vdCode;
    }
    console.log(emailList);
    console.log(vendorToCheck);
    return emailList;
}

module.exports = addOrderToEmailList;