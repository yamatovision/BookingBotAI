import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });

export default calendar;
