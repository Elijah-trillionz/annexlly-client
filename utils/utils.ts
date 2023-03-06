import { json } from '@remix-run/node';

export const apiUrl = `https://annexlly.onrender.com/api`;

export const badRequest = (data: unknown) => {
  return json(data, { status: 400 });
};

export const connectionError = () => {
  return json('Connection error', { status: 500 });
};

export const abbreviateNumber = (value: number) => {
  if (value >= 1000) {
    let newValue = value;
    let stringValue = newValue as unknown as string;
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    let suffixIndex = 0;
    while (newValue >= 1000) {
      newValue /= 1000;
      suffixIndex++;
    }

    stringValue = Number.isInteger(newValue)
      ? newValue.toPrecision(1)
      : newValue.toPrecision(2);

    stringValue += suffixes[suffixIndex];
    return stringValue;
  } else {
    return value;
  }
};

export interface User {
  name: string;
  username: string;
  picture: string;
  id: string;
  createdAt: string;
  email: string;
}

export const dummyUser = {
  name: '',
  username: '',
  picture: '',
  id: '',
  createdAt: '',
  email: '',
};

export interface Annexlly {
  name: string;
  defaultUrl: string;
  id: string;
  newPath: string;
  numOfClicks: number;
  createdAt: string;
}

export const dummyAnnexlly = {
  name: '',
  defaultUrl: '',
  id: '',
  newPath: '',
  numOfClicks: 0,
  createdAt: '',
};
