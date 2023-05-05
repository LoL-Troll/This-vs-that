selectedBrands = 0

function showBrandsTitle() {
  brandsTitle = document.getElementById("brands-title");
  if (selectedBrands === 0) {
    brandsTitle.style.display = 'none';
  } else {
    brandsTitle.style.display = 'block';
  }
}

function showPhoneBrands() {
  var checkbox = (document.getElementById('phone'));

  const box = document.getElementById('phone-brands-filter');

  if (checkbox.checked) {
    box.style.display = 'block';
    selectedBrands++;
  } else {
    box.style.display = 'none';
    selectedBrands--;
  }

  showBrandsTitle;
  showBrandsTitle();
}

function showMonitorBrands() {
  var checkbox = (document.getElementById('monitor'));

  const box = document.getElementById('monitor-brands-filter');

  if (checkbox.checked) {
    box.style.display = 'block';
    selectedBrands++;
  } else {
    box.style.display = 'none';
    selectedBrands--;
  }
  showBrandsTitle();
}

function showHeadphoneBrands() {
  var checkbox = (document.getElementById('headphone'));

  const box = document.getElementById('headphone-brands-filter');

  if (checkbox.checked) {
    box.style.display = 'block';
    selectedBrands++;
  } else {
    box.style.display = 'none';
    selectedBrands--;
  }
  showBrandsTitle();
}

function showMouseBrands() {
  var checkbox = (document.getElementById('mouse'));

  const box = document.getElementById('mouse-brands-filter');

  if (checkbox.checked) {
    box.style.display = 'block';
    selectedBrands++;
  } else {
    box.style.display = 'none';
    selectedBrands--;
  }
  showBrandsTitle();
}

function showKeyboardBrands() {
  var checkbox = (document.getElementById('keyboard'));

  const box = document.getElementById('keyboard-brands-filter');

  if (checkbox.checked) {
    box.style.display = 'block';
    selectedBrands++;
  } else {
    box.style.display = 'none';
    selectedBrands--;
  }
  showBrandsTitle();
}


