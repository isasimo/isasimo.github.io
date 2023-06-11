// Generate a cache-busting parameter
    const cacheBuster = new Date().getTime();

    // Fetch CSV data
    fetch(`data.csv?${cacheBuster}`)
      .then(response => response.text())
      .then(data => {
        const parsedData = parseCSV(data);
        console.log(parsedData);

        // Extract timestamp, humitat, nitrogen, potàssi, and fòsfor data
        const timestamps = parsedData.map(entry => entry.Timestamp);
        const humidities = parsedData.map(entry => parseFloat(entry.Humitat));
        const nitrogen = parsedData.map(entry => parseFloat(entry.Nitrogen));
        const potassium = parsedData.map(entry => parseFloat(entry.Potassi));
        const phosphorus = parsedData.map(entry => parseFloat(entry.Fosfor));

        // Create chart Humitat
        const humidityChartCtx = document.getElementById('chart').getContext('2d');
        new Chart(humidityChartCtx, {
          type: 'bar',
          data: {
            labels: timestamps,
            datasets: [
              {
                label: 'Humitat',
                data: humidities,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: {
                ticks: {
                  callback: value => value
                },
                min: 0,
                max: 1,
                stepSize: 0.25
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: context => {
                  const value = context.dataset.data[context.dataIndex];
                  let label = '';
                    if (value < 0.3) {
                      label = 'Baixa';
                    } else if (value >= 0.3 && value <= 0.7) {
                      label = 'Mitjana';
                    } else {
                      label = 'Alta';
                    }
                    return `Humitat: ${value} - ${label}`;
                  }
                }
              }
            }
          }
        });

        // Create NPK chart
        const NPKChartCtx = document.getElementById('NPKChart').getContext('2d');
        new Chart(NPKChartCtx, {
          type: 'line',
          data: {
            labels: timestamps,
            datasets: [
              {
                label: 'Nitrogen',
                data: nitrogen,
                borderColor: 'rgba(255, 99, 132, 1)',
                pointBorderWidth: 5,
                borderWidth: 3,
                fill: false
              },
              {
                label: 'Potassi',
                data: potassium,
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBorderWidth: 5,
                borderWidth: 3,
                fill: false
              },
              {
                label: 'Fòsfor',
                data: phosphorus,
                borderColor: 'rgba(75, 192, 192, 1)',
                pointBorderWidth: 5,
                borderWidth: 3,
                fill: false
              }
            ]
          },
          options: {
            scales: {
              y: {
                ticks: {
                  callback: value => value
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: context => {
                    const datasetLabel = context.dataset.label || '';
                    const value = context.dataset.data[context.dataIndex];
                    return `${datasetLabel}: ${value}`;
                  }
                }
              }
            }
          }
        });
      })
      .catch(error => console.error(error));

    // CSV parsing function
    function parseCSV(csv) {
      const lines = csv.split('\n');
      const result = [];
      const headers = lines[0].split(',');

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        if (currentLine.length !== headers.length) continue;
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
          entry[headers[j]] = currentLine[j];
        }

        result.push(entry);
      }

      return result;
    }