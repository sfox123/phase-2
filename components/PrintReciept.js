import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';
import items from '../api/comodities';

const handlePrintReceipt = async (
  cartItems,
  pin,
  balance,
  assignedRetailer,
  orderID,
  e,
) => {

  console.log(`PRINTER: Print request received for Order ID ${orderID} for Beneficiary ${pin}`);

  let [retailerName, retailerDS, retailerGN] = ['N/A', 'N/A', 'N/A'];
  if (Array.isArray(assignedRetailer)) {
      if (assignedRetailer.length > 0) {
         retailerName = assignedRetailer[0].name
         retailerDS = assignedRetailer[0].dsDivision
         retailerGN = assignedRetailer[0].gnDivision

          
      } else {
          console.log("Array is empty");
      }
  } else if (typeof assignedRetailer === 'object' && assignedRetailer !== null) {
      // If it's an object (and not null), directly access the 'name' field
      retailerName = assignedRetailer.name
      retailerDS = assignedRetailer.dsDivision
      retailerGN = assignedRetailer.gnDivision
  } else {
      console.log("Invalid data type for assignedRetailer");
  }

  const selectedBeneficiary = pin;
  try {
    const currentDate = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Colombo', // Set the time zone to Sri Lanka
    });

    // Use the "amount" in your code as needed

    try {
      console.log(`PRINTER: Printing HEADER`);

      // Set alignment to CENTER for the header
      BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      BluetoothEscposPrinter.setBlob(0);

      // Print the header
      BluetoothEscposPrinter.printText('WFP - DSD\n\r', {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
        fonttype: 1,
      });

      // Set alignment to CENTER for the header
      BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      BluetoothEscposPrinter.setBlob(0);

      // Print the header
      BluetoothEscposPrinter.printText('Mini\n\r', {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
        fonttype: 1,
      });

      // Set alignment to CENTER for the header
      BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      BluetoothEscposPrinter.setBlob(0);

      // Print the header
      BluetoothEscposPrinter.printText('Food-City\n\r', {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
        fonttype: 1,
      });

      // Print "Receipt" text
      BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      BluetoothEscposPrinter.setBlob(0);
      BluetoothEscposPrinter.printText('Receipt\n\r', {
        encoding: 'GBK',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
        fonttype: 1,
      });
      BluetoothEscposPrinter.printText(
        '--------------------------------\n\r',
        {},
      );

      // Set alignment to LEFT for the rest of the receipt
      BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);

      BluetoothEscposPrinter.printText(
        'Customer: ' + selectedBeneficiary + '\n\r',
        {},
      );

      BluetoothEscposPrinter.printText('Order#: ' + orderID + '\n\r', {});
      BluetoothEscposPrinter.printText('Printed: ' + currentDate + '\n\r', {});
      console.log(`PRINTER: Printing ITEMS`);

      // Print a separator line
      BluetoothEscposPrinter.printText(
        '--------------------------------\n\r',
        {},
      );

      BluetoothEscposPrinter.printColumn(
        [16, 7, 9], // Adjust column widths as needed
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['Item', 'Qty', 'Amount'], // Column headers
        {},
      );

      // Print an empty line
      BluetoothEscposPrinter.printText('\n\r', {});

      // Loop through cart items and print each item's details, including the unit and amount
      cartItems.forEach(item => {
        const itemEng =
          items.find(i => i.tam === item.name) ||
          items.find(i => i.sin === item.name) ||
          item.name;
        const itemName =
          itemEng && itemEng.eng
            ? itemEng.eng
            : itemEng && itemEng.sin
            ? itemEng.sin
            : item.name;
        const unit = item.unit || '';
        const itemquantity = Number(item.Rquantity) * Number(item.quantity);
        const amount = (item.price * item.quantity).toFixed(2); 

        console.log(`PRINTER: PRINTING ITEM - ${itemName.toString()}, QUANTITY - ${itemquantity}${unit}, AMOUNT - ${amount}`);

        BluetoothEscposPrinter.printColumn(
          [16, 7, 9], // Adjust column widths as needed
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [itemName.toString(), `${itemquantity}${unit}`, amount],
          {
            encoding: 'UTF8',
          },
        );
      });

      // Print an empty line
      BluetoothEscposPrinter.printText('\n\r', {});

      // Calculate and print the total quantity and total amount
      let totalQuantity = 0;
      let totalAmount = 0;
      const totalItems = cartItems.length;

      cartItems.forEach(item => {
        totalQuantity += item.quantity;
        totalAmount += item.price * item.quantity;
      });

      console.log(`PRINTER: Printing TOTAL - ${totalAmount.toFixed(2)} AMOUNT - ${totalItems.toString()}`);


      BluetoothEscposPrinter.printColumn(
        [16, 7, 9], // Adjust column widths as needed
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['Total', totalItems.toString(), totalAmount.toFixed(2)],
        {
          encoding: 'UTF8',
          codepage: 11,
        },
      );

      BluetoothEscposPrinter.printText('\n\r', {});

      console.log(`PRINTER: Printing Voucher Info`);

      BluetoothEscposPrinter.printText(
        '--------------------------------\n\r',
        {},
      );

      // Print additional details
      // BluetoothEscposPrinter.printText("Discount rate: 100%\n\r", {});
      BluetoothEscposPrinter.printText(
        'Total amount: ' + totalAmount.toFixed(2) + '\n\r',
        {},
      );
      BluetoothEscposPrinter.printText(
        'Paid: ' + totalAmount.toFixed(2) + '\n\r',
        {},
      );
      let bal;

      if (e === 0) {
        // If e is equal to 1, subtract totalAmount from 17500
        bal = 17500 - totalAmount.toFixed(2);
      } else {
        // Otherwise, use the original balance value
        bal = balance;
      }
      BluetoothEscposPrinter.printText('Voucher Balance: ' + bal + '\n\r', {});
      // Print printing timestamp and footer
      BluetoothEscposPrinter.printText(
        '--------------------------------\n\r',
        {},
      );

      console.log(`PRINTER: Printing Retailer Info`);

      BluetoothEscposPrinter.printText(
        'Retailer: ' + retailerName + '\n\r',
        {},
      );

      BluetoothEscposPrinter.printText(
        retailerDS +
          ' - ' +
          retailerGN +
          '\n\r',
        {},
      );

      console.log(`PRINTER: Printing Footer`);

      BluetoothEscposPrinter.printText(
        '--------------------------------\n\r',
        {},
      );

      // Set alignment to CENTER for the thank you message
      BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

      // Print a thank you message
      BluetoothEscposPrinter.printText('Thank you for your visit\n\r', {});
      //   BluetoothEscposPrinter.printText('Voucher expires on ' + cycle.to, {});
      BluetoothEscposPrinter.printText('\n\r', {});
      BluetoothEscposPrinter.printText('\n\r', {});
      BluetoothEscposPrinter.printText('\n\r', {});
      BluetoothEscposPrinter.printText('\n\r', {});
      BluetoothEscposPrinter.printText('\n\r', {});


      console.log(`PRINTER: Printing Done`);

    } catch (warning) {
      console.log('Printer Warning', warning);
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export default handlePrintReceipt;
