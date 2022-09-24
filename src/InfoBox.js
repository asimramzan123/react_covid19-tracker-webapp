// type rfce (react functional components within expo) and it will pop up this data pre-built snippets

import { Card, CardContent, Typography} from '@material-ui/core'
import React from 'react'


function InfoBox({title, cases, isRed, active, total, ...props}) {
  return (
    <Card 
      className={`infoBox ${active && 'infoBox--selected'}${
        isRed && 'infoBox--red' 
      }`} 
      onClick={props.onClick}>
        <CardContent> 
          
            {/* CARD TITLE */}
            <Typography color='textSecondary' className='infoBox__title'>
                 {title}
            </Typography>

            {/* NO OF CASES */}
            <h2 
              className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}
              >
              {cases}
            </h2>

            {/* TOTAL CASES */}
            <Typography color='textSecondary' className='infoBox__total'>
                 {total} Total
            </Typography>

        </CardContent>
    </Card>
  )
}

export default InfoBox
