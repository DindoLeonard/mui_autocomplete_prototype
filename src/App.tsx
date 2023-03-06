import { useEffect, useState } from 'react';
import './App.css';
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import axios from 'axios';

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

type UserType = {
  id: number;
  name: string;
  email: string;
};

function App() {
  const [data, setData] = useState<UserType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState<UserType | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  console.count('render');

  const debouncedInputValue = useDebounce(inputValue, 500);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async (abortController: AbortController) => {
      try {
        setLoading(true);
        const fetchedData = await axios.get(
          `https://jsonplaceholder.typicode.com/users`,
          { signal: abortController.signal }
        );

        console.log(fetchedData);
        const { data: users } = fetchedData;

        if (users.length) {
          setData(users);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData(controller);

    return () => {
      controller.abort();
      setLoading(false);
    };
  }, [debouncedInputValue]);

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div className="App">
      <Autocomplete
        fullWidth
        options={data}
        renderInput={(params) => {
          return (
            <TextField
              label="Selection here....."
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          );
        }}
        getOptionLabel={(option) => {
          return option.name; // this is the key that they will look for in the input
        }}
        renderOption={(props, options) => {
          return <li {...props}>{options.name}</li>;
        }}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        value={value}
        isOptionEqualToValue={(option, value) => {
          return option.id === value.id;
        }}
        onChange={(_event, newValue) => {
          // console.log(event, newValue);
          setValue(newValue);
        }}
        sx={{ width: '500px' }}
        noOptionsText={<Button>Add new</Button>}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        loading={loading}
      />
    </div>
  );
}

export default App;

// const data2 = [
//   { label: 'The Shawshank Redemption', year: 1994 },
//   { label: 'The Godfather', year: 1972 },
//   { label: 'The Godfather: Part II', year: 1974 },
//   { label: 'The Dark Knight', year: 2008 },
//   { label: '12 Angry Men', year: 1957 },
//   { label: "Schindler's List", year: 1993 },
//   { label: 'Pulp Fiction', year: 1994 },
// ];
