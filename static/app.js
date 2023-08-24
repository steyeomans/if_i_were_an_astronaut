import { h, Component, render } from 'https://esm.sh/preact';
import { useState, useEffect, useRef } from 'https://esm.sh/preact/hooks';
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.4.0/+esm'
import htm from 'https://esm.sh/htm';
import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.3.3/+esm';

Chart.register(...registerables);
Chart.defaults.backgroundColor = 'rgba(0, 0, 0, 1)';
Chart.defaults.color = 'rgba(0, 0, 0, 1)';
const htmlWrapper = htm.bind(h);

function Step0({ onNextClick }) {

  return htmlWrapper`
      <h3 class="text-center mb-3">How Many Hours Would I Have Spent In Space?</h3>
      <div class="mb-3">
          <p class="text-center">
            This 4 question quiz is designed to estimate how many mission hours you would have spent in space.
            The responses are used to make an inference against a model trained on the <a class="text-dark" href="https://www.kaggle.com/datasets/jessemostipak/astronaut-database">Astronaut Database</a> put together by <a class="text-dark" href="https://twitter.com/geokaramanis">Georgios Karamanis</a>
          </p>
      </div>             
  `;
}

function Step1({ userData, onNextClick }) {
  const [yearOfBirth, setYearOfBirth] = useState(userData.yearOfBirth || '');
  userData.yearOfBirth = yearOfBirth

  return htmlWrapper`
      <h3 class="text-center mb-3">Step 1: Year of Birth</h3>
      <div class="input-group mb-3">
          <input type="number" class="form-control mb-3" placeholder="Enter year of birth" min="1921" max="2005" value=${yearOfBirth} onChange=${(e) => setYearOfBirth(e.target.value)} required />
      </div>             
  `;
}

function Step2({ userData, onNextClick }) {
  const [homeCountry, setHomeCountry] = useState(userData.homeCountry || '');
  userData.homeCountry = homeCountry

  return htmlWrapper`
      <h3 class="text-center mb-3">Step 2: Home Country</h3>
      <div class="input-group mb-3">
          <select class="form-select" value=${homeCountry} onChange=${(e) => setHomeCountry(e.target.value)}>
              <option value="">Select a country</option>
              <option value="USA">USA</option>
              <option value="Russia">Russia</option>
              <option value="Other">Other</option>
          </select>
      </div>
  `;
}

function Step3({ userData, onNextClick }) {
  const [gender, setGender] = useState(userData.gender || '');
  userData.gender = gender

  return htmlWrapper`
      <h3 class="text-center mb-3">Step 3: Gender</h3>
      <div class="form-check px-0 mb-3">
        <div class="btn-group w-100" role="group">
            <input type="radio" class="btn-check" name="genderbtnradio" id="btnradiomale" checked=${gender === 'Male'} onChange=${() => setGender('Male')} />
            <label class="btn btn-dark border-white w-50" for="btnradiomale">Male</label>

            <input type="radio" class="btn-check" name="genderbtnradio" id="btnradiofemale" checked=${gender === 'Female'} onChange=${() => setGender('Female')} />
            <label class="btn btn-dark border-white w-50" for="btnradiofemale">Female</label>
        </div>
      </div>
  `;
}

function Step4({ userData, onNextClick }) {
  const [ageWhenAstronaut, setAgeWhenAstronaut] = useState(userData.ageWhenAstronaut || '');
  userData.ageWhenAstronaut = ageWhenAstronaut

  return htmlWrapper`
      <h3 class="text-center mb-3">Step 4: Age When Became an Astronaut</h3>
      <input type="number" class="form-control mb-3" placeholder="Enter age" min="18" max="65" value=${ageWhenAstronaut} onChange=${(e) => setAgeWhenAstronaut(e.target.value)} />
  `;
}

function nationChartComponent() {
  const nation_data = {
    labels: ["USA", "Russia", "Other"],
    datasets: [
        {
            label: "Male",
            backgroundColor: "#0B3D91",
            data: [56.8,239.1,65.9]
        },
        {
            label: "Female",
            backgroundColor: "#FC3D21",
            data: [86.9,92.1,36.5]
        }
    ]
  };
  const nationChartRef = useRef(null);

  useEffect(() => {
    const nation_ctx = nationChartRef.current.getContext('2d');
    new Chart(nation_ctx, {
      type: 'bar',
      data: nation_data,
      options: {
          barValueSpacing: 20,
      }
    });
  }, [50]);

  return h('canvas', { ref: nationChartRef, 'style':'background-color:rgba(255,255,255,0.5);border-radius:5px;' });
}

function yearChartComponent() {
  const yearChartRef = useRef(null);
  const xValues = [1925,1930,1935,1940,1945,1950,1955,1960,1965,1970,1975,1980,1985];

  useEffect(() => {
    const year_ctx = yearChartRef.current.getContext('2d');
    new Chart(year_ctx, {
        type: 'line',
        data: {
          labels: xValues,
          datasets: [{
            data: [6.4,17.7,23.9,47.1,82,72.7,82.2,148.2,122.9,156.1,224,174.5,7.9],
            fill: false,
            borderColor: 'rgba(0, 0, 0, 0.8)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }]
        },
        options: {
          plugins: {
            legend: {display: false},
          }
        }
      });
  }, [50]);

  return h('canvas', { ref: yearChartRef, 'style':'background-color:rgba(255,255,255,0.5);border-radius:5px;' });
}

function App() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [result, setResult] = useState(null);
  const [stepError, setStepError] = useState('');

  const onNextClick = (data) => {
    //console.log(step)
    //console.log(userData)
    if (step == 1 && userData.yearOfBirth == '') {
      setStepError('Please enter your year of birth.');
    } else if (step == 1 && parseInt(userData.yearOfBirth) < 1921) {
      setStepError('Please enter a year after 1921.');
    } else if (step == 1 && parseInt(userData.yearOfBirth) > 2005) {
      setStepError('Please enter a year before 2005.');
    } else if (step == 2 && userData.homeCountry == '') {
      setStepError('Please select an option.');
    } else if (step == 3 && userData.gender == '') {
      setStepError('Please select Male or Female.');
    } else if (step == 4 && userData.ageWhenAstronaut == '') {
      setStepError('Please enter an age.');
    } else if (step == 4 && parseInt(userData.ageWhenAstronaut) < 18 ) {
      setStepError('Please enter an age of 18 or more.');
    } else if (step == 4 && parseInt(userData.ageWhenAstronaut) > 65) {
      setStepError('Please enter an age of 65 or less.');
    } else {
      setStepError(''); // Clear the error message
      if (step < 4) {
        setStep(step + 1);
      } else {
        sendDataToServer({ ...userData, ...data });
      }
    }
  };

  const onBackClick = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const onRestartClick = () => {
    document.getElementById('charts').setAttribute('hidden', true);
    setUserData({});
    setResult(null);
    setStep(0);
  };

  const sendDataToServer = async (data) => {
    try {
      const response = await axios.post('/calculate', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resultData = response.data;
      setResult(resultData.mission_time);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return htmlWrapper`
    <div class="container mt-5">
      <h2 class="text-center">If I Were An Astronaut</h2>
      <div class="row justify-content-center">
        <div class="col-12 col-md-6">
          ${
            result !== null ? (
            htmlWrapper`
                <div class="text-center mb-3">
                  <h3>Total Mission Time</h3>
                  <h1>${result} days</h1>
                  <button class="btn btn-dark" onClick=${onRestartClick}>Restart</button>
                </div>
                <div class="text-center mb-3">
                <h3>How Does That Compare?</h3>
                <h4>Average Mission Time by Nationality and Gender</h4>
                <${nationChartComponent}/>
                <h4>Average Mission Time by Birth Year (Grouped 5 Years)</h4>
                <${yearChartComponent}/>
                </div>
              `
            ) : (
              h('div', {}, // Regular JSX syntax for the inner structure
                step === 0 && h(Step0, { onNextClick }),
                step === 1 && h(Step1, { userData, onNextClick }),
                step === 2 && h(Step2, { userData, onNextClick }),
                step === 3 && h(Step3, { userData, onNextClick }),
                step === 4 && h(Step4, { userData, onNextClick }),
                h('p', { class: "text-danger" }, stepError), // Display error message
                step === 0 && h('div', { class: "d-flex justify-content-center" },
                  h('button', { class: "btn btn-dark", onClick: () => setStep(1) }, 'Start Quiz')
                ),
                step > 0 && step <= 4 && h('div', { class: "d-flex justify-content-between" },
                  h('button', { class: "btn btn-secondary", onClick: onBackClick }, 'Back'),
                  h('button', { class: "btn btn-dark", onClick: onNextClick }, 'Next')
                )
              )
            )
          }
        </div>
      </div>
    </div>
  `;
}

render(
  htmlWrapper`<${App} />`,
  document.getElementById('app')
);
