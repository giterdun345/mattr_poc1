import { useState, useEffect } from "react";
import "./App.css";
import Stamp from "./components/stamp";
import file from "./i-140.pdf";

const PDFJS = window.pdfjsLib;
PDFJS.disableWorker = true; // due to CORS

function App() {
  const [pdf, setPdf] = useState("");
  const [width, setWidth] = useState(0);
  const [scale, setScale] = useState(0);
  const [image, setImage] = useState("");
  const [height, setHeight] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfRendering, setPdfRendering] = useState("");
  const [pageRendering, setPageRendering] = useState("");
  const [status, setStatus] = useState("");
  const [stamp, setStamp] = useState("");

  async function showPdf(event) {
    try {
      setPdfRendering(true);
      const file = event.target.files[0];
      const uri = URL.createObjectURL(file);
      var _PDF_DOC = await PDFJS.getDocument({ url: uri });
      setPdf(_PDF_DOC);
      setPdfRendering(false);
      document.getElementById("file-to-upload").value = "";
    } catch (error) {
      alert(error.message);
    }
  }

  function changePage() {
    setCurrentPage();
  }

  async function renderPage() {
    setPageRendering(true);
    console.log("renderpage");
    var page = await pdf.getPage(currentPage);
    console.log("renderpage 2");
    var viewport = page.getViewport(currentPage);
    console.log("renderpage 3");
    var render_context = {
      canvasContext: document.querySelector("#pdf-canvas").getContext("2d"),
      viewport: viewport,
    };
    // console.log("viewport", viewport, viewport.scale);
    setWidth(viewport.width);
    setHeight(viewport.height);
    setScale(viewport.scale);
    setPageRendering(false);
    await page.render(render_context);

    var canvas = document.getElementById("pdf-canvas");
    var img = canvas.toDataURL("image/png");
    setImage(img);
  }

  // .

  useEffect(() => {
    pdf && renderPage();
    // eslint-disable-next-line
  }, [pdf, currentPage]);

  useEffect(() => {
    if (status === "approved") {
      setStamp(
        <Stamp width={width} height={height} file={image} color="green" />
      );
    } else if (status === "deferred") {
      setStamp(
        <Stamp width={width} height={height} file={image} color="blue" />
      );
    } else if (status === "denied") {
      setStamp(
        <Stamp width={width} height={height} file={image} color="red" />
      );
    } else {
      setStamp("");
    }
  }, [status]);

  return (
    <div className="App">
      <button
        id="upload-button"
        onClick={() => document.getElementById("file-to-upload").click()}
      >
        Simulate GET request
      </button>
      <input
        type="file"
        id="file-to-upload"
        accept="application/pdf"
        hidden
        onChange={showPdf}
      />

      {/* <div id="pdf-main-container">
        <div id="pdf-loader" hidden={!pdfRendering}>
          Loading document ...
        </div>
        <div id="pdf-contents">
          <div id="pdf-meta"> */}
      <div id="pdf-buttons">
        <button id="pdf-prev" onClick={() => changePage(currentPage - 1)}>
          Previous
        </button>
        <button id="pdf-next" onClick={() => changePage(currentPage + 1)}>
          Next
        </button>
      </div>
      <div id="page-count-container">
        Page {currentPage} of <div id="pdf-total-pages">{totalPages}</div>
      </div>
      {image ? (
        <div class="dropdown">
          <select
            id="Mobility"
            name="Mobility"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option selected="">Select Status</option>
            <option value="approved">Approved</option>
            <option value="deferred">Deferred</option>
            <option value="denied">Denied</option>
          </select>
        </div>
      ) : (
        ""
      )}
      {/* </div> */}
      {/* //     <canvas id="pdf-canvas" width={width} height={height}></canvas>
      //     <div id="page-loader" hidden={pageRendering}>
      //       Loading page ...
      //     </div>
      //   </div> */}
      {/* // </div> */}
      <canvas
        id="pdf-canvas"
        width={width}
        height={height}
        style={{ visibility: "hidden", position: "absolute" }}
      ></canvas>

      {stamp && status ? stamp : ""}
    </div>
  );
}

export default App;
