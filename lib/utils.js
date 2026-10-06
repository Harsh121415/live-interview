import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Fetches user profile data from the API
 * @param {Function} setUser - Function to set user data in store
 * @param {Function} setLoading - Function to set loading state
 * @returns {Promise} Promise that resolves with user data or rejects with error
 */
export const fetchUserProfile = async (setUser, setLoading = null) => {
  try {
    if (setLoading) setLoading(true);
    
    const response = await axios.get("/api/user/profile");
    const userData = response.data?.data;
    
    if (setUser) setUser(userData);
    if (setLoading) setLoading(false);
    
    return userData;
  } catch (error) {
    if (setLoading) setLoading(false);
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}
📝 Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
Ensure the questions match the tone and structure of a real-life {{type}} interview.
🛠️ Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
  question:"",
  type:'Technical/Behavioral/Experince/Problem Solving/Leaseship'
},{
  ...
}]
🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`;

