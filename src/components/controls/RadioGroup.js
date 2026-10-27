import { FormControl,  RadioGroup as MuiRadioGroup, FormControlLabel, Radio } from '@material-ui/core';

export default function RadioGroup(props) {

    const { name, value, onChange, items, hidden } = props;

    return (
        <div id="activeStatusDiv">
           {
               hidden ? '' : <FormControl>
                {/* <FormLabel>{label}</FormLabel> */}
                <MuiRadioGroup row
                    name={name}
                    value={value}
                    onChange={onChange}>
                    {
                        items.map(
                            item => (
                                <FormControlLabel key={item.id} value={item.id} control={<Radio size="small"/>} label={item.activeStatus} />
                            )
                        )
                        
                    }
                </MuiRadioGroup>
            </FormControl>
           }
        
        </div>
    )
}
