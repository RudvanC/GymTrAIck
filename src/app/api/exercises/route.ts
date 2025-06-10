import axios from "axios";
import { NextResponse } from "next/server";

const API_HOST = "exercisedb.p.rapidapi.com";
const API_KEY = process.env.RAPIDAPI_KEY as string;

const options = {
  method: "GET",
  url: "https://exercisedb.p.rapidapi.com/exercises",
  params: {
    limit: "10",
    offset: "0",
  },
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": API_HOST,
  },
};

export async function GET() {
  try {
    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching exercises" },
      { status: 500 }
    );
  }
}
