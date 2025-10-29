import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InterviewSetupType } from "@/schema/InterviewSetupSchema";

interface InterviewState {
  interviewData: InterviewSetupType | null;
}

const initialState: InterviewState = {
  interviewData: null,
};


export const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setInterviewData: (state, action: PayloadAction<InterviewSetupType>) => {
      state.interviewData = action.payload;
    },
    clearInterviewData: (state) => {
      state.interviewData = null;
    },
  },
});



export const { setInterviewData, clearInterviewData } = interviewSlice.actions;
export default interviewSlice.reducer;
