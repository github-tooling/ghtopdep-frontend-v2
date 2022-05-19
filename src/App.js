import { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  {
    field: 'url',
    headerName: 'url',
    width: 450,
    renderCell: (params) => (
      <a href={params.row.url} target="_blank">
        {new URL(params.row.url).pathname.replace('/', '')}
      </a>
    ),
  },
  { field: 'stars', headerName: 'Stars', width: 120 },
];

const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3000' : 'http://159.223.231.170';

function App() {
  const [repos, setRepos] = useState([]);
  const [deps, setDeps] = useState([]);

  useEffect(() => {
    console.log(process.env.NODE_ENV);
    fetch(`${BASE_URL}/repos`)
      .then((res) => res.json())
      .then((data) => setRepos(data));
  }, []);

  const handleRepoSelect = (repo) => {
    console.log(repo.split(':'));
    const [owner, repoName] = repo.split(':');
    fetch(`${BASE_URL}/repos/${owner}/${repoName}`)
      .then((res) => res.json())
      .then((data) => setDeps(data));
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Autocomplete
          disablePortal
          onInputChange={(event, newInputValue) => {
            handleRepoSelect(newInputValue);
          }}
          options={repos}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Repos" />}
        />
      </div>

      <div style={{ height: 700, width: '100%' }}>
        <DataGrid rows={deps} columns={columns} getRowId={(row) => row.url} />
      </div>
    </div>
  );
}

export default App;
