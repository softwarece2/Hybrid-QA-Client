import { render } from '@testing-library/react';
import TableComponent from 'components/table';
import Footer from "components/Footer";
import Logo from "components/Logo";
import Breadcrumbs from "components/Breadcrumbs";
import Button from "components/Button";
import TextArea from 'components/TextArea';
import ComboBox from 'components/Autocomplete';
import SubmitButton from 'components/SubmitButton';
import ActionButton from 'components/ActionButton';
import Active from "components/Active"
import AutoCompleteNew from 'components/AutoCompleteNew';
import Checkbox from 'components/controls/Checkbox';
import DateTextField from 'components/DateTextField';
import Inactive from 'components/InActive'
import MultilineTextField from 'components/MultilineTextField';
import Radio from "components/Radio"
import Switch from "components/Switch"
import ActionBtn from 'components/controls/ActionBtn';
import Btn from 'components/controls/Btn';
import DatePicker from 'components/controls/DatePicker';
import Input from 'components/controls/Input';
import Loader from 'Loader';
import Printpreviewprod1 from 'pages/Ofdn/Printpreviewprod15';
import Printpreviewprod2 from 'pages/Ofdn/Printpreviewprod2';
import Printpreviewprod3 from 'pages/Ofdn/Printpreviewprod3';
import Printpreviewprod4 from 'pages/Ofdn/Printpreiviewprod4';
import Printpreviewprod5 from 'pages/Ofdn/Printpreviewprod5';
import Printpreviewprod6 from 'pages/Ofdn/Printpreviewprod6';
import Printpreviewprod7 from 'pages/Ofdn/Printpreviewprod7';
import Printpreviewprod8 from 'pages/Ofdn/Printpreviewprod8';
import Printpreviewprod9 from 'pages/Ofdn/Printpreviewprod9';
import Printpreviewprod10 from 'pages/Ofdn/Printpreviewprod10';
import Printpreviewprod11 from 'pages/Ofdn/Printpreviewprod11';
import Printpreviewprod12 from 'pages/Ofdn/Printpreviewprod12';
import Printpreviewprod13 from 'pages/Ofdn/Printpreviewprod13';
import Printpreviewprod14 from 'pages/Ofdn/Printpreviewprod14';
import Printpreviewprod15 from 'pages/Ofdn/Printpreviewprod15';
import Printpreviewprod16 from 'pages/Ofdn/Printpreviewprod16';
import Printpreviewprod17 from 'pages/Ofdn/Printpreviewprod17';
import Printpreviewprod19 from 'pages/Ofdn/Printpreviewprod19';
import Printpreviewprod18 from 'pages/Ofdn/Printpreviewprod18';
import Printpreviewprod20 from 'pages/Ofdn/Printpreviewprod20';
import Printpreviewprod21 from 'pages/Ofdn/Printpreviewprod21';
import Printpreviewprod22 from 'pages/Ofdn/Printpreviewprod22';
import Printpreviewprod23 from 'pages/Ofdn/Printpreviewprod23';
import Printpreviewprod24 from 'pages/Ofdn/Printpreviewprod24';
import Printpreviewprod25 from 'pages/Ofdn/Printpreviewprod25';
import Printpreviewprod26 from 'pages/Ofdn/Printpreviewprod26';
import Printpreviewprod27 from 'pages/Ofdn/Printpreviewprod27';
import Printpreviewprod29 from 'pages/Ofdn/Printpreviewprod29';
import Printpreviewprod30 from 'pages/Ofdn/Printpreviewprod30';
import Printpreviewprod31 from 'pages/Ofdn/Printpreviewprod31';
import Printpreviewprod32 from 'pages/Ofdn/Printpreviewprod32';
import Printpreviewprod33 from 'pages/Ofdn/Printpreviewprod33';
import Printpreviewprod34 from 'pages/Ofdn/Printpreviewprod34';
import Printpreviewprod35 from 'pages/Ofdn/Printpreviewprod35';
import Printpreviewprod36 from 'pages/Ofdn/Printpreviewprod36';
import Printpreviewprod37 from 'pages/Ofdn/Printpreviewprod37';
import Printpreviewprod38 from 'pages/Ofdn/Printpreviewprod38';
import Printpreviewprod39 from 'pages/Ofdn/Printpreviewprod39';
import Printpreviewprod40 from 'pages/Ofdn/Printpreviewprod40';
import Printpreviewprod41 from 'pages/Ofdn/Printpreviewprod41';
import Printpreviewprod42 from 'pages/Ofdn/Printpreviewprod42';
import Printpreviewprod43 from 'pages/Ofdn/Printpreviewprod43';
import Printpreviewprod44 from 'pages/Ofdn/Printpreviewprod44';

// Test case 1: Checks if the TableComponent component renders without errors.
test('renders TableComponent correctly', () => {
  render(<TableComponent props={[]} columns={[]} data={[]} />);
  // This test primarily verifies that the TableComponent component can be rendered
  // without crashing.  It doesn't check for specific content since the columns and data are empty.
});


// Test case 2: Checks if the Footer component renders without errors.
test('renders Footer correctly', () => {
  render(<Footer />);
  // This test verifies that the Footer component renders.  More specific tests could 
  // check for the presence of specific elements within the footer (e.g., copyright text, links).
});


// Test case 3: Checks if the Logo component renders without errors.
test('renders Logo correctly', () => {
  render(<Logo />);
  // This test verifies that the Logo component renders.  More advanced tests would likely 
  // check that the correct image source is loaded or that the logo's styling is correct.
});


// Test case 4: Checks if the Breadcrumbs component renders without errors.
test('renders Breadcrumbs correctly', () => {
  render(<Breadcrumbs />);
  // This test asserts that the Breadcrumbs component can be rendered without issues.  
  // It doesn't verify the breadcrumb trail itself, only that the component is displayed.
});


// Test case 5: Checks if the Button component renders without errors.
test('renders Button correctly', () => {
  render(<Button />);
  // This test asserts that the Button component can be rendered without issues.
  // It doesn't verify the button's functionality or content, only that it is displayed.
});


// Test case 6: Checks if the TextArea component renders without errors.
test('renders TextArea correctly', () => {
  render(<TextArea />);
  // This test asserts that the TextArea component can be rendered without issues.
  // It doesn't verify the TextArea's functionality or content, only that it is displayed.
});


// Test case 7: Checks if the ComboBox component renders without errors.
test('renders ComboBox correctly', () => {
  render(<ComboBox props={[]} />);
  // This test asserts that the ComboBox component can be rendered without issues.
  // It doesn't verify the ComboBox's functionality or content, only that it is displayed.
});


// Test case 8: Checks if the SubmitButton component renders without errors.
test('renders SubmitButton correctly', () => {
  render(<SubmitButton />);
  // This test asserts that the SubmitButton component can be rendered without issues.
  // It doesn't verify the SubmitButton's functionality or content, only that it is displayed.
});


// Test case 9: Checks if the ActionButton component renders without errors.
test('renders ActionButton correctly', () => {
  render(<ActionButton props={[]} />);
  // This test asserts that the ActionButton component can be rendered without issues.
  // It doesn't verify the ActionButton's functionality or content, only that it is displayed.
});


// Test case 10: Checks if the Active component renders without errors.
test('renders Active correctly', () => {
  render(<Active />);
  // This test asserts that the Active component can be rendered without issues.
  // It doesn't verify the Active's functionality or content, only that it is displayed.
});


// Test case 11: Checks if the AutoCompleteNew component renders without errors.
test('renders AutoCompleteNew correctly', () => {
  render(<AutoCompleteNew />);
  // This test asserts that the AutoCompleteNew component can be rendered without issues.
  // It doesn't verify the AutoCompleteNew's functionality or content, only that it is displayed.
});


// Test case 12: Checks if the Checkbox component renders without errors.
test('renders Checkbox correctly', () => {
  render(<Checkbox />);
  // This test asserts that the Checkbox component can be rendered without issues.
  // It doesn't verify the Checkbox's functionality or content, only that it is displayed.
});



// Test case 14: Checks if the DateTextField component renders without errors.
test('renders DateTextField correctly', () => {
  render(<DateTextField />);
  // This test asserts that the DateTextField component can be rendered without issues.
  // It doesn't verify the DateTextField's functionality or content, only that it is displayed.
});

// Test case 15: Checks if the Inactive component renders without errors.
test('renders Inactive correctly', () => {
  render(<Inactive />);
  // This test asserts that the Inactive component can be rendered without issues.
  // It doesn't verify the Inactive's functionality or content, only that it is displayed.
});

// Test case 16: Checks if the MultilineTextField component renders without errors.
test('renders MultilineTextField correctly', () => {
  render(<MultilineTextField />);
  // This test asserts that the MultilineTextField component can be rendered without issues.
  // It doesn't verify the MultilineTextField's functionality or content, only that it is displayed.
});

// Test case 17: Checks if the Radio component renders without errors.
test('renders Radio correctly', () => {
  render(<Radio />);
  // This test asserts that the Radio component can be rendered without issues.
  // It doesn't verify the Radio's functionality or content, only that it is displayed.
});

// Test case 18: Checks if the Switch component renders without errors.
test('renders Switch correctly', () => {
  render(<Switch />);
  // This test asserts that the Switch component can be rendered without issues.
  // It doesn't verify the Switch's functionality or content, only that it is displayed.
});

// Test case 19: Checks if the Switch component renders without errors.
test('renders ActionBtn correctly', () => {
  render(<ActionBtn />);
  // This test asserts that the ActionBtn component can be rendered without issues.
  // It doesn't verify the ActionBtn's functionality or content, only that it is displayed.
});


// Test case 20: Checks if the Btn component renders without errors.
test('renders Btn correctly', () => {
  render(<Btn />);
  // This test asserts that the Btn component can be rendered without issues.
  // It doesn't verify the Btn's functionality or content, only that it is displayed.
});


// Test case 21: Checks if the DatePicker component renders without errors.
test('renders DatePicker correctly', () => {
  render(<DatePicker />);
  // This test asserts that the DatePicker component can be rendered without issues.
  // It doesn't verify the DatePicker's functionality or content, only that it is displayed.
});


// Test case 22: Checks if the Input component renders without errors.
test('renders Input correctly', () => {
  render(<Input />);
  // This test asserts that the Input component can be rendered without issues.});

});


// Test case 23: Checks if the Loader component renders without errors.
test('renders Loader correctly', () => {
  render(<Loader />);
  // This test asserts that the Loader component can be rendered without issues.});
});

// Test case 24: Checks if the Printpreviewprod1 component renders without errors.
test('renders Printpreviewprod1 correctly', () => {
  render(<Printpreviewprod1 />);
});
// Test case 25: Checks if the Printpreviewprod2 component renders without errors.
test('renders Printpreviewprod2 correctly', () => {
  render(<Printpreviewprod2 />);
});
// Test case 26: Checks if the Printpreviewprod3 component renders without errors.
test('renders Printpreviewprod3 correctly', () => {
  render(<Printpreviewprod3 />);
});

// Test case 27: Checks if the Printpreviewprod4 component renders without errors.
test('renders Printpreviewprod4 correctly', () => {
  render(<Printpreviewprod4 />);
  // This test asserts that the Printpreviewprod4 component can be rendered without issues.

});
// Test case 28: Checks if the Printpreviewprod5 component renders without errors.
test('renders Printpreviewprod5 correctly', () => {
  render(<Printpreviewprod5 />);
});
// Test case 29: Checks if the Printpreviewprod6 component renders without errors.
test('renders Printpreviewprod6 correctly', () => {
  render(<Printpreviewprod6 />);
});

// Test case 30: Checks if the Printpreviewprod7 component renders without errors.
test('renders Printpreviewprod7 correctly', () => {
  render(<Printpreviewprod7 />);
});
// Test case 31: Checks if the Printpreviewprod8 component renders without errors.
test('renders Printpreviewprod8 correctly', () => {
  render(<Printpreviewprod8 />);
});
// Test case 32: Checks if the Printpreviewprod9 component renders without errors.
test('renders Printpreviewprod9 correctly', () => {
  render(<Printpreviewprod9 />);
});
// Test case 33: Checks if the Printpreviewprod10 component renders without errors.
test('renders Printpreviewprod10 correctly', () => {
  render(<Printpreviewprod10 />);
});
// Test case 35: Checks if the Printpreviewprod11 component renders without errors.
test('renders Printpreviewprod11 correctly', () => {
  render(<Printpreviewprod11 />);
});
// Test case 36: Checks if the Printpreviewprod12 component renders without errors.
test('renders Printpreviewprod12 correctly', () => {
  render(<Printpreviewprod12 />);
});
// Test case 37: Checks if the Printpreviewprod13 component renders without errors.
test('renders Printpreviewprod13 correctly', () => {
  render(<Printpreviewprod13 />);
});
// Test case 38: Checks if the Printpreviewprod14 component renders without errors.
test('renders Printpreviewprod14 correctly', () => {
  render(<Printpreviewprod14 />);
});
// Test case 39: Checks if the Printpreviewprod15 component renders without errors.
test('renders Printpreviewprod15 correctly', () => {
  render(<Printpreviewprod15 />);
});
// Test case 40: Checks if the Printpreviewprod16 component renders without errors.
test('renders Printpreviewprod16 correctly', () => {
  render(<Printpreviewprod16 />);
});
// Test case 41: Checks if the Printpreviewprod17 component renders without errors.
test('renders Printpreviewprod17 correctly', () => {
  render(<Printpreviewprod17 />);
});
// Test case 42: Checks if the Printpreviewprod18 component renders without errors.
test('renders Printpreviewprod18 correctly', () => {
  render(<Printpreviewprod18 />);
});
// Test case 43: Checks if the Printpreviewprod19 component renders without errors.
test('renders Printpreviewprod19 correctly', () => {
  render(<Printpreviewprod19 />);
});

// Test case 44: Checks if the Printpreviewprod20 component renders without errors.
test('renders Printpreviewprod20 correctly', () => {
  render(<Printpreviewprod20 />);
});

// Test case 45: Checks if the Printpreviewprod21 component renders without errors.
test('renders Printpreviewprod21 correctly', () => {
  render(<Printpreviewprod21 />);
});

// Test case 46: Checks if the Printpreviewprod22 component renders without errors.
test('renders Printpreviewprod22 correctly', () => {
  render(<Printpreviewprod22 />);
});

// Test case 47: Checks if the Printpreviewprod23 component renders without errors.
test('renders Printpreviewprod23 correctly', () => {
  render(<Printpreviewprod23 />);
});

// Test case 48: Checks if the Printpreviewprod24 component renders without errors.
test('renders Printpreviewprod24 correctly', () => {
  render(<Printpreviewprod24 />);
});

// Test case 49: Checks if the Printpreviewprod25 component renders without errors.
test('renders Printpreviewprod25 correctly', () => {
  render(<Printpreviewprod25 />);
});

// Test case 50: Checks if the Printpreviewprod26 component renders without errors.
test('renders Printpreviewprod26 correctly', () => {
  render(<Printpreviewprod26 />);
});

// Test case 51: Checks if the Printpreviewprod27 component renders without errors.
test('renders Printpreviewprod27 correctly', () => {
  render(<Printpreviewprod27 />);
});
// Test case 52: Checks if the Printpreviewprod29 component renders without errors.
test('renders Printpreviewprod29 correctly', () => {
  render(<Printpreviewprod29 />);
});

// Test case 53: Checks if the Printpreviewprod30 component renders without errors.
test('renders Printpreviewprod30 correctly', () => {
  render(<Printpreviewprod30 />);
});

// Test case 54: Checks if the Printpreviewprod31 component renders without errors.
test('renders Printpreviewprod31 correctly', () => {
  render(<Printpreviewprod31 />);
});


// Test case 55: Checks if the Printpreviewprod32 component renders without errors.
test('renders Printpreviewprod32 correctly', () => {
  render(<Printpreviewprod32 />);
});
// Test case 56: Checks if the Printpreviewprod33 component renders without errors.
test('renders Printpreviewprod33 correctly', () => {
  render(<Printpreviewprod33 />);
});
// Test case 57: Checks if the Printpreviewprod34 component renders without errors.
test('renders Printpreviewprod34 correctly', () => {
  render(<Printpreviewprod34 />);
});
// Test case 58: Checks if the Printpreviewprod35 component renders without errors.
test('renders Printpreviewprod35 correctly', () => {
  render(<Printpreviewprod35 />);
});
// Test case 59: Checks if the Printpreviewprod36 component renders without errors.
test('renders Printpreviewprod36 correctly', () => {
  render(<Printpreviewprod36 />);
});


// Test case 61: Checks if the Printpreviewprod37 component renders without errors.
test('renders Printpreviewprod37 correctly', () => {
  render(<Printpreviewprod37 />);
});

// Test case 62: Checks if the Printpreviewprod38 component renders without errors.
test('renders Printpreviewprod38 correctly', () => {
  render(<Printpreviewprod38 />);
});

// Test case 63: Checks if the Printpreviewprod39 component renders without errors.
test('renders Printpreviewprod39 correctly', () => {
  render(<Printpreviewprod39 />);
});

// Test case 64: Checks if the Printpreviewprod40 component renders without errors.
test('renders Printpreviewprod40 correctly', () => {
  render(<Printpreviewprod40 />);
});

// Test case 59: Checks if the Printpreviewprod41 component renders without errors.
test('renders Printpreviewprod41 correctly', () => {
  render(<Printpreviewprod41 />);
});

// Test case 59: Checks if the Printpreviewprod42 component renders without errors.
test('renders Printpreviewprod42 correctly', () => {
  render(<Printpreviewprod42 />);
});

// Test case 65: Checks if the Printpreviewprod43 component renders without errors.
test('renders Printpreviewprod43 correctly', () => {
  render(<Printpreviewprod43 />);
});

// Test case 66: Checks if the Printpreviewprod44 component renders without errors.
test('renders Printpreviewprod44 correctly', () => {
  render(<Printpreviewprod44 />);
});






















