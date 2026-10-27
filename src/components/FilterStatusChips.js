import { Chip } from '@material-ui/core';
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const FilterStatusChips = ({ filterStatus, handleCheckboxChange, configs, labelText = "Filter By:" ,isSo}) => {

  return (
    <div style={{ padding: '15px', display: 'flex', gap: '12px', alignItems: 'center' }}>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#666' }}>
      {/* {!isSo ?{labelText}:""} */}
      </span>
      
      {configs.map((config) => {
        const isSelected = filterStatus.includes(config.id);

        return (
          <Chip
            key={config.id}
            label={config.label}
            onClick={() => handleCheckboxChange(config.id)}
            clickable
            icon={isSelected ? <CheckCircleIcon style={{ color: '#fff', fontSize: '18px' }} /> : null}
            style={{
              fontWeight: 'bold',
              borderRadius: '50px',
              backgroundColor: isSelected ? config.color : config.lightBg,
              color: isSelected ? '#ffffff' : config.color,
              transition: 'all 0.3s ease',
              border: 'none',
              paddingLeft: isSelected ? '8px' : '12px',
              paddingRight: isSelected ? '8px' : '12px'
            }}
          />
        );
      })}
    </div>
  );
};

export default FilterStatusChips;