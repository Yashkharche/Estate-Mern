import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    error:null,
    loading:false
};

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null
        },
        signInFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        updateUserStart:(state)=>{
            state.loading=true;
        },
        updatedUserSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        updateUserFailure:(state,action)=>{
            state.error=action.payload
            state.loading=false
        },
        deleteUserStart:(state)=>{
            state.loading=true;
        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=false;
        },
        deleteUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },

        logoutUserStart:(state)=>{
            state.loading=true;
        },
        logoutUserSuccess:(state)=>{
            state.loading=false;
            state.currentUser=null;
            state.error=null;
        },
        logoutUserFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        }

    }
})


export const {signInStart,signInSuccess,signInFailure,updateUserStart,updatedUserSuccess,updateUserFailure,logoutUserStart,logoutUserSuccess,logoutUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure}=userSlice.actions

export default userSlice.reducer;