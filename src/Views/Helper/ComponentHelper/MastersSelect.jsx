import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '../../../Redux/Actions/globalActions';
import CustomDropdown04 from '../../../Components/CustomDropdown/CustomDropdown04';
import { otherIcons } from '../SVGIcons/ItemsIcons/Icons';

const MastersSelect = ({ ...rest }) => {

    const dispatch = useDispatch();

    const { masterData } = useSelector(state => state?.masterData);

    useEffect(() => {
        dispatch(fetchMasterData())
    }, [dispatch]);
    return (
        <>
            <>
                <label >Payment Terms</label>
                <span >
                    {otherIcons.placeofsupply_svg}
                    <CustomDropdown04
                        label="Payment Terms"
                        options={masterData?.filter(type => type.type === "8")}
                        defaultOption="Select Payment Terms"
                        autoComplete='off'
                        type="masters"
                        {...rest}
                    />
                </span>
            </>
        </>
    )
}

export default MastersSelect