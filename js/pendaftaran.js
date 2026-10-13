document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#registration-form');
  if (!form) return;

  const confirmation = document.querySelector('#confirmation-panel');
  const summary = document.querySelector('#summary-panel');
  const errors = {
    nik: document.querySelector('#nik-error'),
    nama: document.querySelector('#nama-error'),
    gender: document.querySelector('#gender-error'),
    telepon: document.querySelector('#telepon-error'),
    alamat: document.querySelector('#alamat-error'),
    bahasa: document.querySelector('#bahasa-error')
  };
  let confirmedValues = null;

  const setError = (control, message, errorElement) => {
    errorElement.textContent = message;
    if (control) {
      if (message) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');
    }
  };

  function validate() {
    let firstInvalid = null;
    const nik = form.elements.nik;
    const name = form.elements.nama;
    const phone = form.elements.telepon;
    const address = form.elements.alamat;
    const gender = form.querySelector('input[name="gender"]');
    const language = form.querySelector('input[name="bahasa"]');
    const digitsPhone = phone.value.replace(/[\s()-]/g, '').replace(/^\+62/, '0');

    const check = (control, valid, message, errorElement) => {
      setError(control, valid ? '' : message, errorElement);
      if (!valid && !firstInvalid) firstInvalid = control;
    };

    check(nik, /^\d{16}$/.test(nik.value.trim()), 'NIK harus terdiri dari tepat 16 digit angka.', errors.nik);
    check(name, name.value.trim().length >= 2, 'Nama lengkap wajib diisi minimal 2 karakter.', errors.nama);
    const genderSelected = Boolean(form.querySelector('input[name="gender"]:checked'));
    setError(gender, genderSelected ? '' : 'Pilih salah satu jenis kelamin.', errors.gender);
    if (!genderSelected && !firstInvalid) firstInvalid = gender;
    check(phone, /^0\d{9,14}$/.test(digitsPhone), 'Masukkan nomor HP valid dengan 10–15 digit.', errors.telepon);
    check(address, address.value.trim().length >= 5, 'Alamat wajib diisi minimal 5 karakter.', errors.alamat);
    const languages = [...form.querySelectorAll('input[name="bahasa"]:checked')].map((input) => input.value);
    setError(language, languages.length ? '' : 'Pilih setidaknya satu bahasa pemrograman.', errors.bahasa);
    if (!languages.length && !firstInvalid) firstInvalid = language;

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function getValues() {
    return {
      nik: form.elements.nik.value.trim(),
      nama: form.elements.nama.value.trim(),
      gender: form.querySelector('input[name="gender"]:checked').value,
      telepon: form.elements.telepon.value.trim(),
      alamat: form.elements.alamat.value.trim(),
      bahasa: [...form.querySelectorAll('input[name="bahasa"]:checked')].map((input) => input.value)
    };
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validate()) return;
    confirmedValues = getValues();
    form.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
  });

  document.querySelector('#confirm-no').addEventListener('click', () => {
    confirmation.hidden = true;
    form.hidden = false;
    form.elements.nik.focus();
  });

  document.querySelector('#confirm-yes').addEventListener('click', () => {
    if (!confirmedValues) return;
    const values = [
      ['NIK', confirmedValues.nik],
      ['Nama lengkap', confirmedValues.nama],
      ['Jenis kelamin', confirmedValues.gender],
      ['Nomor HP', confirmedValues.telepon],
      ['Alamat', confirmedValues.alamat],
      ['Bahasa pemrograman', confirmedValues.bahasa.join(', ')]
    ];
    const list = document.querySelector('#summary-list');
    list.replaceChildren();
    values.forEach(([label, value]) => {
      const row = document.createElement('div');
      row.className = 'summary-row';
      const term = document.createElement('dt');
      term.textContent = label;
      const description = document.createElement('dd');
      description.textContent = value;
      row.append(term, description);
      list.append(row);
    });
    confirmation.hidden = true;
    summary.hidden = false;
    summary.focus();
  });

  document.querySelector('#edit-again').addEventListener('click', () => {
    summary.hidden = true;
    form.hidden = false;
    confirmedValues = null;
    form.elements.nik.focus();
  });

  form.addEventListener('input', (event) => {
    const key = event.target.name;
    if (key === 'nik' || key === 'nama' || key === 'telepon' || key === 'alamat') {
      setError(event.target, '', errors[key]);
    }
  });
  form.addEventListener('change', (event) => {
    if (event.target.name === 'gender') setError(event.target, '', errors.gender);
    if (event.target.name === 'bahasa') setError(event.target, '', errors.bahasa);
  });
});
