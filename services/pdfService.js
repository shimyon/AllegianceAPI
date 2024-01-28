const puppeteer = require("puppeteer");

const generatePDF = async (htmlContent) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();
      return pdfBuffer;
    } catch (error) {
      throw error;
    }
  }

  module.exports = {
    generatePDF
  }