// Constants
const MATRIX_CONTAINER = document.querySelector('.matrix-container');
const BUTTON_OPERATION = document.getElementById("operation");
const INPUT_FIELD_STYLE = 'matrix-input-field';
const GRID_COLUMN_START = 'gridColumnStart';
const GRID_ROW_START = 'gridRowStart';
const resultContainer = document.getElementById("result")

// Function to get input values
function getMatrixSizes() {
  const sizeA = parseInt(document.getElementById('sizeA').value);
  const sizeB = parseInt(document.getElementById('sizeB').value);
  return { sizeA, sizeB };
}

// Function to create a matrix
function createMatrix(sizeA, sizeB) {
  const matrix = Array(sizeA).fill(0).map(() => Array(sizeB).fill(0));
  return matrix;
}

// Function to create an input field
function createInputField() {
  const inputField = document.createElement('input');
  inputField.style.borderRadius = "5px";
  inputField.style.width = "50px";
  inputField.style.height = "50px";
  inputField.style.background = "white";
  inputField.style.textAlign = "center";
  inputField.style.fontSize = "large";
  inputField.style.fontweight = "800";
  inputField.style.fontFamily = "Poppins, sans-serif";
  inputField.style.border = "3px solid black";
  inputField.type = 'number';
  inputField.className = INPUT_FIELD_STYLE;
  return inputField;
}

// Function to generate the matrix
function generateMatrix() {
  const { sizeA, sizeB } = getMatrixSizes();
  const matrixInputFields = [];
  const matrixValues = [];

  // Hapus elemen-elemen yang sudah ada di container
  while (MATRIX_CONTAINER.firstChild) {
    MATRIX_CONTAINER.removeChild(MATRIX_CONTAINER.firstChild);
  }

  // Buat matriks baru dengan ukuran yang diinginkan
  for (let i = 0; i < sizeA; i++) {
    matrixInputFields.push([]);
    matrixValues.push([]);
    for (let j = 0; j < sizeB; j++) {
      const inputField = createInputField();
      matrixInputFields[i].push(inputField);
      MATRIX_CONTAINER.appendChild(inputField);
      inputField.addEventListener('input', () => {
        matrixValues[i][j] = parseInt(inputField.value);
      });
    }
  }

  // Atur posisi elemen-elemen di grid
  for (let i = 0; i < sizeA; i++) {
    for (let j = 0; j < sizeB; j++) {
      matrixInputFields[i][j].style.gridColumnStart = j + 1;
      matrixInputFields[i][j].style.gridRowStart = i + 1;
    }
  }

  window.matrixValues = matrixValues;
}

// Function to generate the operation buttons
function generateOperationButtons() {
  const { sizeA, sizeB } = getMatrixSizes();

  // Check if buttons already exist
  const buttonOperation = document.getElementById("operation");
  if (buttonOperation.childElementCount > 0) {
    return;
  }

  // Create the operation buttons
  const determinantButton = createButton("Determinant");
  const transposeButton = createButton("Transpose");
  const inversButton = createButton("Invers");
  const clearButton = createButton("Clear");

  clearButton.style.backgroundColor = "red"
  clearButton.style.display = "flex"
  clearButton.style.justifyContent = "center"
  clearButton.style.alignContent = "center"
  clearButton.style.alignItems = "center"
  clearButton.style.margin = "auto"
  clearButton.style.marginTop = "20px"
  clearButton.style.marginBottom = "0px"
  clearButton.onmouseover = function() {
    this.style.cursor = "pointer";
    this.style.backgroundColor = "grey";
    this.style.color = "white";
    this.style.transition = "0.5s";
  };
  clearButton.onmouseout = function() {
    this.style.cursor = "pointer";
    this.style.backgroundColor = "red";
    this.style.color = "black";
  };

  // Append the buttons to the container
  buttonOperation.append(determinantButton);
  buttonOperation.append(transposeButton);
  buttonOperation.append(inversButton);

  clearButton.addEventListener('click', function() {
    if (!resultContainer) {
      console.error('Result container not found');
      return;
    }
  
    // Clear the existing content of resultContainer
    while (resultContainer.firstChild) {
      resultContainer.removeChild(resultContainer.firstChild);
      resultContainer.style.border = "transparent"
    }
  });

  determinantButton.addEventListener('click', function() {
    if (!resultContainer) {
      console.error('Result container not found');
      return;
    }
  
    const determinantValue = determinant(window.matrixValues);
    const resultText = document.createElement("p")
    resultText.innerHTML = `Determinant of the matrix is: ${determinantValue}`
    resultText.style.borderRadius = "5px"
    resultText.style.padding = "15px"
    resultText.style.color = "white"
    resultText.style.marginTop = "0px"
    resultContainer.style.border = "1px solid white"
    resultContainer.style.marginTop = "50px"
  
    // Clear the existing content of resultContainer
    while (resultContainer.firstChild) {
      resultContainer.removeChild(resultContainer.firstChild);
    }
  
    // Append the new resultText to resultContainer
    resultContainer.appendChild(resultText);
    console.log(`Determinant of the matrix is: ${determinantValue}`);
    resultContainer.append(clearButton)
  });

  transposeButton.addEventListener('click', function() {
    const transposedMatrix = transpose(window.matrixValues);
    const transposedMatrixInputFields = [];
    const resultContainer = document.getElementById('result');
  
    if (!resultContainer) {
      console.error('Result container not found');
      return;
    }
  
    // Add a paragraph element with the text "transpose of the matrix is:"
    const resultText = document.createElement("p");
    resultText.textContent = "transpose of the matrix is:";
    resultText.style.padding = "5px";
    resultText.style.color = "white";
    resultText.style.marginTop = "0px";
    resultText.style.textAlign = "center";
    resultContainer.style.marginTop = "50px"


    console.log(resultText);
  
    // Remove any existing rows and input fields
    while (resultContainer.firstChild) {
      resultContainer.removeChild(resultContainer.firstChild);
    }
    resultContainer.append(resultText);
    // Create a new row for each row of the transposed matrix
    for (let i = 0; i < transposedMatrix.length; i++) {
      const row = document.createElement('div');
      row.style.display = 'flex';
      resultContainer.appendChild(row);
      resultContainer.style.border = "solid 1px white"
      resultContainer.style.borderRadius = "5px"


  
      transposedMatrixInputFields.push([]);
      for (let j = 0; j < transposedMatrix[i].length; j++) {
        const inputField = createInputField();
        inputField.value = transposedMatrix[i][j];
        inputField.readOnly = true;
        row.appendChild(inputField);
        transposedMatrixInputFields[i].push(inputField);
      }
    }
  
    // Set the grid properties of each input field
    for (let i = 0; i < transposedMatrixInputFields.length; i++) {
      for (let j = 0; j < transposedMatrixInputFields[i].length; j++) {
        transposedMatrixInputFields[i][j].style.gridColumnStart = j + 1;
        transposedMatrixInputFields[i][j].style.gridRowStart = i + 1;
      }
    }
    resultContainer.append(clearButton)
    
    // Add some styling to the result container
  });

  inversButton.addEventListener('click', function() {
    const matrixValues = window.matrixValues;
    const determinantValue = determinant(matrixValues);
  
    if (determinantValue === 0) {
      alert('The matrix is singular and cannot be inverted.');
      return;
    }
  
    const inverseMatrix = invert(matrixValues);
    const inverseMatrixInputFields = [];
    const resultContainer = document.getElementById('result');
  
    resultContainer.style.marginTop = "50px"
  
    if (!resultContainer) {
      console.error('Result container not found');
      return;
    }
  
    // Remove any existing rows and input fields
    while (resultContainer.firstChild) {
      resultContainer.removeChild(resultContainer.firstChild);
    }
  
    // Add a paragraph element with the text "inverse of the matrix is:"
    const resultText = document.createElement("p");
    resultText.textContent = "inverse of the matrix is:";
    resultText.style.padding = "5px";
    resultText.style.color = "white";
    resultText.style.marginTop = "0px";
    resultText.style.textAlign = "center";
    resultContainer.append(resultText);
  
    // Create a new row for each row of the inverse matrix
    for (let i = 0; i < inverseMatrix.length; i++) {
      const row = document.createElement('div');
      row.style.display = 'flex';
      resultContainer.appendChild(row);
      resultContainer.style.border = "solid 1px white"
      resultContainer.style.borderRadius = "5px"
  
      inverseMatrixInputFields.push([]);
      for (let j = 0; j < inverseMatrix[i].length; j++) {
        const inputField = createInputField();
        inputField.value = inverseMatrix[i][j];
        inputField.readOnly = true;
        row.appendChild(inputField);
        inverseMatrixInputFields[i].push(inputField);
      }
    }
  
    // Set the grid properties of each input field
    for (let i = 0; i < inverseMatrixInputFields.length; i++) {
      for (let j = 0; j < inverseMatrixInputFields[i].length; j++) {
        inverseMatrixInputFields[i][j].style.gridColumnStart = j + 1;
        inverseMatrixInputFields[i][j].style.gridRowStart = i + 1;
      }
    }
    resultContainer.append(clearButton)
    // Add some styling to the result container
  });
}

// Function to create a button
function createButton(textContent) {
  const button = document.createElement("button");
  button.textContent = textContent;
  button.style.borderRadius = "5px";
  button.style.color = "black";
  button.style.marginTop = "20px";
  button.style.padding = "8px 32px";
  button.style.fontSize = "16px";
  button.style.fontWeight = "600";
  button.style.border = "none";
  button.style.backgroundColor = "#3effe2";
  button.style.marginRight = "10px";
  button.style.marginBottom = "20px";
  button.style.height = "40px";
  button.style.width = "200px";
  button.style.display = "flexbox";
  button.style.justifyContent = "center";
  button.onmouseover = function() {
    this.style.cursor = "pointer";
    this.style.backgroundColor = "#186055";
    this.style.color = "white";
    this.style.transition = "0.5s";
  };
  button.onmouseout = function() {
    this.style.cursor = "pointer";
    this.style.backgroundColor = "#3effe2";
    this.style.color = "black";
  };
  return button;
}

// Function to calculate the determinant of a matrix
function determinant(matrix) {
  if (!matrix || matrix.length === 0) {
    throw new Error('Matrix is empty');
  }

  if (matrix.length === 1) {
    return matrix[0][0];
  }

  if (matrix.length === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  const getMinor = (matrix, row, col) => {
    return matrix.slice(0, row).concat(matrix.slice(row + 1)).map(row => row.slice(0, col).concat(row.slice(col + 1)));
  };

  const det = matrix[0].reduce((acc, val, i) => acc + Math.pow(-1, i) * val * determinant(getMinor(matrix, 0, i)), 0);
  return det;
}

//Transpose___________________________________________________
function transpose(matrix) {
  if (!matrix || matrix.length === 0) {
    throw new Error('Matrix is empty');
  }

  const transposed = [];

  for (let i = 0; i < matrix[0].length; i++) {
    transposed[i] = [];
    for (let j = 0; j < matrix.length; j++) {
      transposed[i][j] = matrix[j][i];
    }
  }

  return transposed;
}
//_____________________INVERSSSSSSSSSSSS__________________________
function invert(matrix) {
  if (!matrix || matrix.length === 0) {
    throw new Error('Matrix is empty');
  }

  if (matrix.length !== matrix[0].length) {
    throw new Error('Matrix is not square');
  }

  const det = determinant(matrix);
  if (det === 0) {
    throw new Error('Matrix is singular');
  }

  if (matrix.length === 2) {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];
    return [[d / det, -b / det], [-c / det, a / det]];
  }

  const matrixOfMinors = matrix.map((row, i) => row.map((_, j) => determinant(minor(matrix, i, j))));
  const matrixOfCofactors = matrixOfMinors.map((row, i) => row.map((val, j) => Math.pow(-1, i + j) * val));
  const adjugate = transpose(matrixOfCofactors);

  for (let i = 0; i < adjugate.length; i++) {
    for (let j = 0; j < adjugate[i].length; j++) {
      adjugate[i][j] /= det;
    }
  }

  return adjugate;
}

function minorDiagonal(matrix, row) {
  return matrix.slice(0, row).concat(matrix.slice(row + 1)).map(row => row.slice(1));
}

function minor(matrix, row, col) {
  const min = [];
  for (let i = 0; i < matrix.length; i++) {
    if (i === row) continue;
    const rowArr = [];
    for (let j = 0; j < matrix.length; j++) {
      if (j === col) continue;
      rowArr.push(matrix[i][j]);
    }
    min.push(rowArr);
  }
  return min;
}


// Add event listener to the generate button
const generateButton = document.querySelector('.generate-button');
generateButton.addEventListener('click', generateMatrix);
generateButton.addEventListener('click', generateOperationButtons);