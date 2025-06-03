import React, { Component, FC, Fragment, useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { generalOptionContextType, GeneralOptionContextProvider } from "../utils/preference/general";
import { themeContextType, ThemeContextProvider } from "../utils/preference/theme";
import "./option.scss";
import { SyncedCheckbox, SyncedColorPicker, SyncedSelect, SyncedNumberInput } from "./syncedInput";


type OptionProps = {};
type OptionState = {
	selectionRangeBg?: string,
	selectedBg?: string
};

class Option extends Component<OptionProps, OptionState> {

	constructor(props: OptionProps) {
		super(props);
		this.state = {};
	}
	render() {
		return <Fragment>
			<ThemeContextProvider><GeneralOptionContextProvider>
				<ThemeOption />
				<GeneralOption />
				{/* <SaveButton /> */}
			</GeneralOptionContextProvider></ThemeContextProvider>
		</Fragment>;
	}
}
const SaveButton: FC = () => {
	return (
		<generalOptionContextType.Consumer>{(gc) =>
			<themeContextType.Consumer>{(tc) =>
				<button id="save" onClick={() => { gc._save(); tc._save(); alert("Saved.") }}>Save</button>
			}</themeContextType.Consumer>
		}</generalOptionContextType.Consumer>
	)
}
const GeneralOption:FC = () => {

	return (
		<div className="optionBox">
			<h1>General</h1>
			<SyncedCheckbox label="Use CPM instead of WPM" optionkey="useCpm" />
			<SyncedCheckbox label="Animated" optionkey="animated" />
			
			<h2>Text Processing</h2>
			<SyncedCheckbox label="Normalize special characters" optionkey="normalizeSpecialChars" />
			<SyncedCheckbox label="Normalize accented characters (é to e)" optionkey="normalizeAccents" />
			<SyncedCheckbox label="Skip special characters during typing" optionkey="skipSpecialChars" />
			<SyncedCheckbox label="Use lowercase only" optionkey="useLowercaseOnly" />
			
			<generalOptionContextType.Consumer>
				{(context) => (
					<button className="centeredButton" onClick={context._reset}>Reset</button>
				)}
			</generalOptionContextType.Consumer>
		</div>
	);
}

const ThemeOption: FC = () => {
	const [fontOptions, setFontOptions] = useState([
		{ value: "inherit", label: "Use page font" },
		{ value: "Arial, sans-serif", label: "Arial" },
		{ value: "Georgia, serif", label: "Georgia" },
		{ value: "Times New Roman, serif", label: "Times New Roman" },
		{ value: "Courier New, monospace", label: "Courier New" },
		{ value: "Helvetica, Arial, sans-serif", label: "Helvetica" },
		{ value: "Verdana, sans-serif", label: "Verdana" },
		{ value: "Trebuchet MS, sans-serif", label: "Trebuchet MS" }
	]);

	useEffect(() => {
		if (chrome.fontSettings && chrome.fontSettings.getFontList) {
			chrome.fontSettings.getFontList((fonts) => {
				const systemFonts = fonts
					.sort((a, b) => a.displayName.localeCompare(b.displayName))
					.map(font => ({
						value: `"${font.displayName}", sans-serif`,
						label: `${font.displayName} (System)`
					}));
				
				setFontOptions(prev => [
					...prev.slice(0, 8), // Keep standard fonts (without the old system font option)
					...systemFonts
				]);
			});
		}
	}, []);

	const fontSizeOptions = [
		{ value: "inherit", label: "Use page size" },
		{ value: "12px", label: "12px" },
		{ value: "14px", label: "14px" },
		{ value: "16px", label: "16px" },
		{ value: "18px", label: "18px" },
		{ value: "20px", label: "20px" },
		{ value: "22px", label: "22px" },
		{ value: "24px", label: "24px" },
		{ value: "28px", label: "28px" },
		{ value: "32px", label: "32px" },
		{ value: "36px", label: "36px" },
		{ value: "40px", label: "40px" },
		{ value: "48px", label: "48px" },
		{ value: "56px", label: "56px" },
		{ value: "64px", label: "64px" },
		{ value: "72px", label: "72px" },
		{ value: "80px", label: "80px" },
		{ value: "88px", label: "88px" },
		{ value: "96px", label: "96px" },
		{ value: "100px", label: "100px" }
	];

	return (
		<div className="optionBox">
			<h1>Theme</h1>
			<SyncedColorPicker label="Selection Range" optionkey="elementSelectionRangeBg" />
			<SyncedColorPicker label="Selected Elements" optionkey="elementSelectedBg" />
			<SyncedColorPicker label="Typing Overlay Background" optionkey="typingOverlayBg" />
			<SyncedColorPicker label="Typing Overlay Text" optionkey="typingOverlayFg" />
			<SyncedColorPicker label="Typing Overlay Wrong Text" optionkey="wrongText" />
			<SyncedColorPicker label="Typing Overlay Composing Text" optionkey="composingText" />
			
			<h2>Typography</h2>
			<SyncedSelect label="Font Family" optionkey="fontFamily" options={fontOptions} />
			<SyncedSelect label="Font Size" optionkey="fontSize" options={fontSizeOptions} />
			<SyncedCheckbox label="Bold Text" optionkey="fontWeight" />
			
			<themeContextType.Consumer>
				{(context) => (
					<button className="centeredButton" onClick={context._reset}>Reset</button>
				)}
			</themeContextType.Consumer >
		</div>
	);
}

ReactDOM.render(<Option />, document.getElementById("root"));
