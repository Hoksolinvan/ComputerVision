import React from 'react';


export default function FileInput(){
    return(
        <>
        <label for="avatar">Choose a profile picture:</label>

<input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
        </>



    )
}