import { getCurrentUser } from '../auth.js';
import { t } from '../i18n.js';
import { API_BASE } from '../config.js';

export function renderDiseaseScan(container) {
  container.innerHTML = `
    <section class="space-y-4">
      <h1 class="text-xl font-semibold" data-i18n="diseaseScan.title">${t('diseaseScan.title')}</h1>
      <div class="bg-white rounded-2xl shadow-md p-4 space-y-3">
        <div id="cameraArea" class="space-y-2">
          <video id="video" class="w-full rounded" autoplay playsinline></video>
          <div class="flex gap-2">
            <button id="startCam" class="px-3 py-2 rounded bg-gray-100">Start Camera</button>
            <button id="capture" class="px-3 py-2 rounded bg-green-600 text-white">Capture</button>
            <input id="fileInput" type="file" accept="image/*" capture="environment" class="px-3 py-2 border rounded">
          </div>
          <canvas id="canvas" class="hidden"></canvas>
        </div>
        <div id="previewArea" class="hidden space-y-2">
          <img id="previewImg" alt="Preview" class="w-full rounded" />
          <div class="flex gap-2">
            <button id="retake" class="px-3 py-2 rounded bg-gray-100">Retake</button>
            <button id="upload" class="px-3 py-2 rounded bg-blue-600 text-white">Upload</button>
          </div>
          <div class="w-full h-2 bg-gray-100 rounded"><div id="progress" class="h-2 bg-green-600 rounded" style="width:0%"></div></div>
        </div>
        <div id="result" class=""></div>
      </div>
    </section>`;

  const video = container.querySelector('#video');
  const canvas = container.querySelector('#canvas');
  const startCam = container.querySelector('#startCam');
  const capture = container.querySelector('#capture');
  const fileInput = container.querySelector('#fileInput');
  const previewArea = container.querySelector('#previewArea');
  const previewImg = container.querySelector('#previewImg');
  const retake = container.querySelector('#retake');
  const uploadBtn = container.querySelector('#upload');
  const progressEl = container.querySelector('#progress');
  const resultEl = container.querySelector('#result');

  let stream;
  startCam.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      video.srcObject = stream;
    } catch (e) {
      alert('Camera not available. Use file upload.');
    }
  });

  capture.addEventListener('click', () => {
    if (!video.videoWidth) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => showPreview(blob), 'image/jpeg', 0.9);
  });

  fileInput.addEventListener('change', () => {
    const f = fileInput.files?.[0];
    if (f) showPreview(f);
  });

  retake.addEventListener('click', () => {
    previewArea.classList.add('hidden');
  });

  uploadBtn.addEventListener('click', () => doUpload());

  function showPreview(file) {
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.dataset.blobUrl = url;
    previewImg.file = file;
    previewArea.classList.remove('hidden');
  }

  function doUpload() {
    const user = getCurrentUser();
    const file = previewImg.file;
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file, 'capture.jpg');
    fd.append('farmerId', user?.id || 'demo-farmer');
    fd.append('plotId', 'plot-1');
    fd.append('cropType', 'wheat');

    // Use XHR to track progress
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/disease/scan`);
    const token = localStorage.getItem('sf_token');
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        progressEl.style.width = pct + '%';
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          showResult(res);
        } catch { resultEl.textContent = 'Upload complete.'; }
      } else if (xhr.status === 401) {
        location.hash = '#/login';
      } else {
        resultEl.textContent = `Error: ${xhr.status}`;
      }
    };

    xhr.onerror = () => { resultEl.textContent = 'Network Error'; };
    xhr.send(fd);
  }

  function showResult(res) {
    resultEl.innerHTML = `
      <div class="mt-3 bg-white rounded-2xl shadow p-4">
        <div class="font-medium">${res.label || 'Result'}</div>
        <div class="text-sm text-gray-600">Confidence: ${res.confidence ? Math.round(res.confidence*100) : '--'}%</div>
        ${Array.isArray(res.recommendations) ? `<details class="mt-2"><summary>Recommendations</summary><ul class="list-disc pl-5">${res.recommendations.map(r=>`<li>${r}</li>`).join('')}</ul></details>` : ''}
        <button class="mt-3 px-3 py-2 rounded bg-gray-100">Save Report</button>
      </div>`;
  }
}
