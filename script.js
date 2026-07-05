/* =========================================================
   STATISTIK PRO APP - FINAL 8 MENU
   ========================================================= */

/* =========================
   NAVIGASI MENU
========================= */
const menuItems = document.querySelectorAll(".menu-item");
const sections = document.querySelectorAll(".content-section");

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((btn) => btn.classList.remove("active"));
    item.classList.add("active");

    const target = item.getAttribute("data-target");
    sections.forEach((section) => section.classList.remove("active-section"));

    const activeSection = document.getElementById(target);
    if (activeSection) {
      activeSection.classList.add("active-section");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
});

/* =========================
   HELPER
========================= */
function round(num, digits = 3) {
  return Number(num).toFixed(digits);
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function varianceSample(arr) {
  if (arr.length < 2) return 0;
  const avg = mean(arr);
  return arr.reduce((sum, x) => sum + Math.pow(x - avg, 2), 0) / (arr.length - 1);
}

function stdSample(arr) {
  return Math.sqrt(varianceSample(arr));
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function mode(arr) {
  const freq = {};
  let maxFreq = 0;
  let modes = [];

  arr.forEach((num) => {
    freq[num] = (freq[num] || 0) + 1;
    if (freq[num] > maxFreq) maxFreq = freq[num];
  });

  for (const key in freq) {
    if (freq[key] === maxFreq) modes.push(Number(key));
  }

  if (modes.length === Object.keys(freq).length) return "Tidak ada modus";
  return modes.join(", ");
}

function pearsonCorrelation(x, y) {
  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const den = Math.sqrt(denX * denY);
  if (den === 0) return 0;
  return num / den;
}

function parseNumberArray(text) {
  const raw = text
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");

  const nums = raw.map((v) => Number(v));
  if (nums.some((n) => isNaN(n))) return null;
  return nums;
}

function parseMatrix(text) {
  const lines = text
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  if (lines.length === 0) return null;

  const matrix = lines.map((line) => {
    const row = line
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "")
      .map(Number);
    return row;
  });

  if (matrix.some((row) => row.some((val) => isNaN(val)))) return null;

  const colCount = matrix[0].length;
  if (colCount < 2) return null;
  if (matrix.some((row) => row.length !== colCount)) return null;

  return matrix;
}

function toggleInterpretation(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("hidden-box");
}

function showError(targetId, message) {
  document.getElementById(targetId).innerHTML = `
    <div class="alert alert-error">${message}</div>
  `;
}

function showSuccess(targetId, message) {
  document.getElementById(targetId).innerHTML = `
    <div class="alert alert-success">${message}</div>
  `;
}

/* =========================
   UJI DESKRIPTIF
========================= */
function fillDescriptiveExample() {
  document.getElementById("descriptiveInput").value = "70, 80, 65, 90, 75, 88, 92, 78, 84, 73";
}

function resetDescriptive() {
  document.getElementById("descriptiveInput").value = "";
  document.getElementById("descriptiveResult").innerHTML = "Belum ada hasil uji deskriptif.";
  document.getElementById("descriptiveResult").className = "result-box empty-state";
  document.getElementById("descriptiveInterpretation").innerHTML = `
    <h4>Interpretasi Uji Deskriptif</h4>
    <div class="empty-state small">Interpretasi akan muncul setelah data dihitung.</div>
  `;
}

function runDescriptive() {
  const input = document.getElementById("descriptiveInput").value.trim();
  const data = parseNumberArray(input);

  if (!data || data.length < 2) {
    showError("descriptiveResult", "Masukkan minimal 2 angka yang valid, dipisahkan dengan koma.");
    return;
  }

  const n = data.length;
  const avg = mean(data);
  const med = median(data);
  const mod = mode(data);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const variance = varianceSample(data);
  const std = Math.sqrt(variance);

  document.getElementById("descriptiveResult").className = "result-box";
  document.getElementById("descriptiveResult").innerHTML = `
    <div class="result-grid">
      <div class="result-item"><h4>Jumlah Data (n)</h4><p>${n}</p></div>
      <div class="result-item"><h4>Mean</h4><p>${round(avg)}</p></div>
      <div class="result-item"><h4>Median</h4><p>${round(med)}</p></div>
      <div class="result-item"><h4>Modus</h4><p>${mod}</p></div>
      <div class="result-item"><h4>Minimum</h4><p>${round(min)}</p></div>
      <div class="result-item"><h4>Maksimum</h4><p>${round(max)}</p></div>
      <div class="result-item"><h4>Range</h4><p>${round(range)}</p></div>
      <div class="result-item"><h4>Varians</h4><p>${round(variance)}</p></div>
      <div class="result-item"><h4>Standar Deviasi</h4><p>${round(std)}</p></div>
    </div>
  `;

  let interpretasi = `
    <h4>Interpretasi Uji Deskriptif</h4>
    <p>Data yang dianalisis berjumlah <strong>${n}</strong> observasi.</p>
    <ul>
      <li><strong>Mean = ${round(avg)}</strong>, artinya rata-rata nilai data berada di sekitar angka tersebut.</li>
      <li><strong>Median = ${round(med)}</strong>, artinya nilai tengah data adalah ${round(med)}.</li>
      <li><strong>Modus = ${mod}</strong>, yaitu nilai yang paling sering muncul.</li>
      <li><strong>Minimum = ${round(min)}</strong> dan <strong>maksimum = ${round(max)}</strong>, sehingga rentang data adalah <strong>${round(range)}</strong>.</li>
      <li><strong>Standar deviasi = ${round(std)}</strong>, menunjukkan tingkat penyebaran data dari rata-ratanya.</li>
    </ul>
  `;

  document.getElementById("descriptiveInterpretation").innerHTML = interpretasi;
}

/* =========================
   UJI VALIDITAS
========================= */
function fillValidityExample() {
  document.getElementById("validityInput").value =
`4,5,4,5
3,4,4,4
5,5,5,5
4,4,3,4
3,3,4,3
5,4,5,5
4,5,4,4
3,4,3,4`;
  document.getElementById("rTableInput").value = 0.30;
}

function resetValidity() {
  document.getElementById("validityInput").value = "";
  document.getElementById("rTableInput").value = 0.30;
  document.getElementById("validityResult").innerHTML = "Belum ada hasil uji validitas.";
  document.getElementById("validityResult").className = "result-box empty-state";
  document.getElementById("validityInterpretation").innerHTML = `
    <h4>Interpretasi Uji Validitas</h4>
    <div class="empty-state small">Interpretasi akan muncul setelah data dihitung.</div>
  `;
}

function runValidity() {
  const matrix = parseMatrix(document.getElementById("validityInput").value);
  const rTable = Number(document.getElementById("rTableInput").value);

  if (!matrix) {
    showError("validityResult", "Format data tidak valid. Gunakan satu responden per baris, dan pisahkan item dengan koma.");
    return;
  }

  if (isNaN(rTable) || rTable < 0 || rTable > 1) {
    showError("validityResult", "Nilai r tabel harus angka antara 0 sampai 1.");
    return;
  }

  const respondentCount = matrix.length;
  const itemCount = matrix[0].length;
  const totals = matrix.map((row) => row.reduce((a, b) => a + b, 0));

  let rowsHTML = "";
  let validCount = 0;
  const itemResults = [];

  for (let j = 0; j < itemCount; j++) {
    const itemScores = matrix.map((row) => row[j]);
    const totalWithoutItem = matrix.map((row, i) => totals[i] - row[j]);
    const r = pearsonCorrelation(itemScores, totalWithoutItem);
    const status = r >= rTable ? "Valid" : "Tidak Valid";

    if (status === "Valid") validCount++;

    itemResults.push({ item: j + 1, r, status });

    rowsHTML += `
      <tr>
        <td>Item ${j + 1}</td>
        <td>${round(r)}</td>
        <td>${round(rTable)}</td>
        <td>${status === "Valid"
          ? '<span class="badge-valid">Valid</span>'
          : '<span class="badge-invalid">Tidak Valid</span>'}
        </td>
      </tr>
    `;
  }

  document.getElementById("validityResult").className = "result-box";
  document.getElementById("validityResult").innerHTML = `
    <div class="table-wrap">
      <table class="result-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>r hitung</th>
            <th>r tabel</th>
            <th>Keputusan</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    </div>
  `;

  const invalidItems = itemResults.filter((it) => it.status !== "Valid").map((it) => `Item ${it.item}`);

  document.getElementById("validityInterpretation").innerHTML = `
    <h4>Interpretasi Uji Validitas</h4>
    <p>Data terdiri dari <strong>${respondentCount}</strong> responden dan <strong>${itemCount}</strong> item.</p>
    <p>Dengan <strong>r tabel = ${round(rTable)}</strong>, diperoleh:</p>
    <ul>
      <li><strong>${validCount}</strong> item dinyatakan <strong>valid</strong>.</li>
      <li><strong>${itemCount - validCount}</strong> item dinyatakan <strong>tidak valid</strong>.</li>
      ${
        invalidItems.length > 0
          ? `<li>Item yang perlu dievaluasi: <strong>${invalidItems.join(", ")}</strong>.</li>`
          : `<li>Semua item telah valid dan dapat digunakan.</li>`
      }
    </ul>
    <p>Artinya, item yang valid sudah cukup baik dalam mengukur konstruk/variabel yang diteliti.</p>
  `;
}

/* =========================
   UJI RELIABILITAS
========================= */
function fillReliabilityExample() {
  document.getElementById("reliabilityInput").value =
`4,5,4,5
3,4,4,4
5,5,5,5
4,4,3,4
3,3,4,3
5,4,5,5
4,5,4,4
3,4,3,4`;
}

function resetReliability() {
  document.getElementById("reliabilityInput").value = "";
  document.getElementById("reliabilityResult").innerHTML = "Belum ada hasil uji reliabilitas.";
  document.getElementById("reliabilityResult").className = "result-box empty-state";
  document.getElementById("reliabilityInterpretation").innerHTML = `
    <h4>Interpretasi Uji Reliabilitas</h4>
    <div class="empty-state small">Interpretasi akan muncul setelah data dihitung.</div>
  `;
}

function cronbachAlpha(matrix) {
  const nRespondents = matrix.length;
  const k = matrix[0].length;
  if (k < 2 || nRespondents < 2) return 0;

  const itemVariances = [];
  for (let j = 0; j < k; j++) {
    const itemScores = matrix.map((row) => row[j]);
    itemVariances.push(varianceSample(itemScores));
  }

  const totalScores = matrix.map((row) => row.reduce((a, b) => a + b, 0));
  const totalVariance = varianceSample(totalScores);

  if (totalVariance === 0) return 0;

  const sumItemVar = itemVariances.reduce((a, b) => a + b, 0);
  const alpha = (k / (k - 1)) * (1 - sumItemVar / totalVariance);

  return { alpha, itemVariances, totalVariance, k, nRespondents };
}

function runReliability() {
  const matrix = parseMatrix(document.getElementById("reliabilityInput").value);

  if (!matrix) {
    showError("reliabilityResult", "Format data tidak valid. Gunakan satu responden per baris, dan pisahkan item dengan koma.");
    return;
  }

  const result = cronbachAlpha(matrix);

  if (!result || isNaN(result.alpha)) {
    showError("reliabilityResult", "Data tidak dapat dihitung reliabilitasnya.");
    return;
  }

  let status = "";
  if (result.alpha >= 0.90) status = "Sangat Reliabel";
  else if (result.alpha >= 0.80) status = "Reliabel";
  else if (result.alpha >= 0.70) status = "Cukup Reliabel";
  else if (result.alpha >= 0.60) status = "Kurang Reliabel";
  else status = "Tidak Reliabel";

  let rowsHTML = "";
  result.itemVariances.forEach((v, i) => {
    rowsHTML += `
      <tr>
        <td>Item ${i + 1}</td>
        <td>${round(v)}</td>
      </tr>
    `;
  });

  document.getElementById("reliabilityResult").className = "result-box";
  document.getElementById("reliabilityResult").innerHTML = `
    <div class="result-grid" style="margin-bottom:16px;">
      <div class="result-item">
        <h4>Jumlah Responden</h4>
        <p>${result.nRespondents}</p>
      </div>
      <div class="result-item">
        <h4>Jumlah Item</h4>
        <p>${result.k}</p>
      </div>
      <div class="result-item">
        <h4>Cronbach's Alpha</h4>
        <p>${round(result.alpha)}</p>
      </div>
    </div>

    <div class="table-wrap">
      <table class="result-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Varians Item</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("reliabilityInterpretation").innerHTML = `
    <h4>Interpretasi Uji Reliabilitas</h4>
    <p>Hasil perhitungan menunjukkan nilai <strong>Cronbach's Alpha = ${round(result.alpha)}</strong>.</p>
    <ul>
      <li>Status reliabilitas instrumen: <strong>${status}</strong>.</li>
      <li>Jumlah responden: <strong>${result.nRespondents}</strong>.</li>
      <li>Jumlah item: <strong>${result.k}</strong>.</li>
    </ul>
    <p>
      Semakin tinggi nilai Cronbach's Alpha, semakin konsisten jawaban antar item.
      Umumnya instrumen dianggap reliabel jika nilai alpha <strong>≥ 0,70</strong>.
    </p>
  `;
}

/* =========================
   KALKULATOR NILAI Z
========================= */
function calculateZ() {
  const z = Number(document.getElementById("zConfidence").value);

  document.getElementById("zResult").className = "result-box";
  document.getElementById("zResult").innerHTML = `
    <div class="result-grid">
      <div class="result-item">
        <h4>Nilai Z</h4>
        <p>${round(z)}</p>
      </div>
    </div>
  `;

  document.getElementById("zInterpretation").innerHTML = `
    <h4>Interpretasi Nilai Z</h4>
    <p>Untuk tingkat kepercayaan yang dipilih, nilai Z yang digunakan adalah <strong>${round(z)}</strong>.</p>
    <ul>
      <li>90% → Z = 1,645</li>
      <li>95% → Z = 1,96</li>
      <li>99% → Z = 2,576</li>
    </ul>
    <p>Nilai ini biasa digunakan pada perhitungan ukuran sampel dan uji hipotesis berbasis distribusi normal.</p>
  `;
}

function resetZ() {
  document.getElementById("zConfidence").value = "1.96";
  document.getElementById("zResult").innerHTML = "Belum ada hasil nilai Z.";
  document.getElementById("zResult").className = "result-box empty-state";
  document.getElementById("zInterpretation").innerHTML = `
    <h4>Interpretasi Nilai Z</h4>
    <div class="empty-state small">Interpretasi akan muncul setelah perhitungan dilakukan.</div>
  `;
}

/* =========================
   KALKULATOR UKURAN SAMPEL
========================= */
function calculateSample() {
  const z = Number(document.getElementById("sampleConfidence").value);
  const e = Number(document.getElementById("sampleError").value);
  const p = Number(document.getElementById("sampleProportion").value);
  const Nraw = document.getElementById("samplePopulation").value.trim();

  if (isNaN(z) || isNaN(e) || isNaN(p) || e <= 0 || p <= 0 || p >= 1) {
    showError("sampleResult", "Periksa input Z, margin of error, dan proporsi awal. Pastikan nilainya valid.");
    return;
  }

  const q = 1 - p;
  const n0 = (Math.pow(z, 2) * p * q) / Math.pow(e, 2);

  let html = `
    <div class="result-grid">
      <div class="result-item">
        <h4>Ukuran Sampel Dasar (n)</h4>
        <p>${Math.ceil(n0)}</p>
      </div>
    </div>
  `;

  let interpretation = `
    <h4>Interpretasi Ukuran Sampel</h4>
    <p>Berdasarkan input yang diberikan, ukuran sampel minimal untuk populasi besar / tidak diketahui adalah <strong>${Math.ceil(n0)}</strong> responden.</p>
  `;

  if (Nraw !== "") {
    const N = Number(Nraw);
    if (isNaN(N) || N <= 0) {
      showError("sampleResult", "Jumlah populasi (N) harus angka positif jika diisi.");
      return;
    }

    const nf = n0 / (1 + ((n0 - 1) / N));

    html = `
      <div class="result-grid">
        <div class="result-item">
          <h4>Ukuran Sampel Dasar (n)</h4>
          <p>${Math.ceil(n0)}</p>
        </div>
        <div class="result-item">
          <h4>Ukuran Sampel Koreksi (nf)</h4>
          <p>${Math.ceil(nf)}</p>
        </div>
      </div>
    `;

    interpretation = `
      <h4>Interpretasi Ukuran Sampel</h4>
      <p>Ukuran sampel dasar untuk populasi besar adalah <strong>${Math.ceil(n0)}</strong> responden.</p>
      <p>Karena jumlah populasi diketahui yaitu <strong>${N}</strong>, dilakukan koreksi populasi terbatas sehingga ukuran sampel akhir menjadi <strong>${Math.ceil(nf)}</strong> responden.</p>
    `;
  }

  document.getElementById("sampleResult").className = "result-box";
  document.getElementById("sampleResult").innerHTML = html;
  document.getElementById("sampleInterpretation").innerHTML = interpretation;
}

function resetSample() {
  document.getElementById("sampleConfidence").value = "1.96";
  document.getElementById("sampleError").value = "0.05";
  document.getElementById("sampleProportion").value = "0.5";
  document.getElementById("samplePopulation").value = "";
  document.getElementById("sampleResult").innerHTML = "Belum ada hasil ukuran sampel.";
  document.getElementById("sampleResult").className = "result-box empty-state";
  document.getElementById("sampleInterpretation").innerHTML = `
    <h4>Interpretasi Ukuran Sampel</h4>
    <div class="empty-state small">Interpretasi akan muncul setelah perhitungan dilakukan.</div>
  `;
}

/* =========================
   UJI HIPOTESIS
   Z TEST SATU SAMPEL PROPORSI
========================= */
function fillHypothesisExample() {
  document.getElementById("hypothesisP").value = "0.78";
  document.getElementById("hypothesisP0").value = "0.70";
  document.getElementById("hypothesisN").value = "385";
  document.getElementById("hypothesisAlpha").value = "0.05";
}

function resetHypothesis() {
  document.getElementById("hypothesisP").value = "";
  document.getElementById("hypothesisP0").value = "";
  document.getElementById("hypothesisN").value = "";
  document.getElementById("hypothesisAlpha").value = "0.05";
  document.getElementById("hypothesisResult").innerHTML = "Belum ada hasil uji hipotesis.";
  document.getElementById("hypothesisResult").className = "result-box empty-state";
  document.getElementById("hypothesisInterpretation").innerHTML = `
    <h4>Interpretasi Uji Hipotesis</h4>
    <div class="empty-state small">Interpretasi akan muncul setelah perhitungan dilakukan.</div>
  `;
}

function getZCritical(alpha) {
  if (alpha === 0.10) return 1.282;
  if (alpha === 0.05) return 1.645;
  if (alpha === 0.01) return 2.326;
  return 1.645;
}

function runHypothesis() {
  const pHat = Number(document.getElementById("hypothesisP").value);
  const p0 = Number(document.getElementById("hypothesisP0").value);
  const n = Number(document.getElementById("hypothesisN").value);
  const alpha = Number(document.getElementById("hypothesisAlpha").value);

  if (
    isNaN(pHat) || isNaN(p0) || isNaN(n) ||
    pHat <= 0 || pHat >= 1 ||
    p0 <= 0 || p0 >= 1 ||
    n <= 0
  ) {
    showError("hypothesisResult", "Masukkan proporsi sampel, proporsi hipotesis, dan ukuran sampel dengan benar.");
    return;
  }

  const denominator = Math.sqrt((p0 * (1 - p0)) / n);
  if (denominator === 0) {
    showError("hypothesisResult", "Perhitungan tidak dapat dilakukan karena penyebut bernilai nol.");
    return;
  }

  const zHitung = (pHat - p0) / denominator;
  const zTabel = getZCritical(alpha);
  const keputusan = zHitung > zTabel ? "Tolak H₀" : "Gagal Menolak H₀";

  document.getElementById("hypothesisResult").className = "result-box";
  document.getElementById("hypothesisResult").innerHTML = `
    <div class="result-grid">
      <div class="result-item">
        <h4>Proporsi Sampel (p̂)</h4>
        <p>${round(pHat)}</p>
      </div>
      <div class="result-item">
        <h4>Proporsi Hipotesis (p₀)</h4>
        <p>${round(p0)}</p>
      </div>
      <div class="result-item">
        <h4>Ukuran Sampel (n)</h4>
        <p>${n}</p>
      </div>
      <div class="result-item">
        <h4>Z hitung</h4>
        <p>${round(zHitung)}</p>
      </div>
      <div class="result-item">
        <h4>Z tabel</h4>
        <p>${round(zTabel)}</p>
      </div>
      <div class="result-item">
        <h4>Keputusan</h4>
        <p>${keputusan}</p>
      </div>
    </div>
  `;

  document.getElementById("hypothesisInterpretation").innerHTML = `
    <h4>Interpretasi Uji Hipotesis</h4>
    <p>Hasil perhitungan menunjukkan <strong>Z hitung = ${round(zHitung)}</strong> dan <strong>Z tabel = ${round(zTabel)}</strong>.</p>
    <ul>
      <li>Taraf signifikansi yang digunakan: <strong>${alpha}</strong>.</li>
      <li>Karena <strong>${round(zHitung)} ${zHitung > zTabel ? ">" : "≤"} ${round(zTabel)}</strong>, maka keputusan adalah <strong>${keputusan}</strong>.</li>
    </ul>
    <p>
      Artinya, berdasarkan data sampel yang dianalisis, hipotesis penelitian ${
        zHitung > zTabel
          ? "<strong>didukung oleh data</strong> sehingga H₀ ditolak."
          : "<strong>belum memiliki bukti yang cukup</strong> untuk menolak H₀."
      }
    </p>
  `;
}