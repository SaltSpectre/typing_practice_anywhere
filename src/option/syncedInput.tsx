import React, { Component } from "react";
import { getPreference, OptionType } from "../utils/preference/chromeSynced";

type SyncedOptionProps<K extends keyof OptionType>
	= { label: string; optionkey: K; };
type SyncedOptionState<K extends keyof OptionType>
	= { val?: OptionType[K] };

export class SyncedColorPicker<K extends (OptionType[K] extends string ? keyof OptionType: never)>
	extends Component<SyncedOptionProps<K>, SyncedOptionState<K>> {

	constructor(props: SyncedOptionProps<K>) {
		super(props);
		this.state = {};
		getPreference(this.props.optionkey).then(v=>
				this.setState({ val: v })
		);
	}

	onChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
		this.setState({ val: ev.target.value as OptionType[K] });
		chrome.storage.local.set({ [this.props.optionkey]: ev.target.value });
	};
	readonly onChromeStorageChanged: Parameters<typeof chrome.storage.onChanged.addListener>[0] = (changes, areaName) => {
		if (areaName !== "local" || !(this.props.optionkey in changes)) return;

		this.setState({val:changes[this.props.optionkey].newValue});
	}
	componentDidMount() {
		chrome.storage.onChanged.addListener(this.onChromeStorageChanged);
	}
	componentWillUnmount() {
		chrome.storage.onChanged.removeListener(this.onChromeStorageChanged);
	}
	render() {
		return <div className="optionItem">
			<label>{`${this.props.label}: `}</label>
			<input type="color" onChange={this.onChange} value={this.state.val as string ??""} />
		</div>;
	}
}

export class SyncedCheckbox<K extends (OptionType[K] extends boolean ? keyof OptionType : never)>
	extends Component<SyncedOptionProps<K>, SyncedOptionState<K>> {
	
	constructor(props: SyncedOptionProps<K>) {
		super(props);
		this.state = {};
		getPreference(this.props.optionkey).then(v =>
			this.setState({ val: v })
		);
	}

	onChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
		this.setState({ val: ev.target.checked as OptionType[K]});
		chrome.storage.local.set({ [this.props.optionkey]: ev.target.checked });
	};
	readonly onChromeStorageChanged: Parameters<typeof chrome.storage.onChanged.addListener>[0] = (changes, areaName) => {
		if (areaName !== "local" || !(this.props.optionkey in changes)) return;

		this.setState({ val: changes[this.props.optionkey].newValue });
	}
	componentDidMount() {
		chrome.storage.onChanged.addListener(this.onChromeStorageChanged);
	}
	componentWillUnmount() {
		chrome.storage.onChanged.removeListener(this.onChromeStorageChanged);
	}

	render() {
		return <div className="optionItem">
			<label>{`${this.props.label}: `}</label>
			<input type="checkbox" onChange={this.onChange} checked={this.state.val as boolean ?? false} />
		</div>;
	}
}

export class SyncedSelect<K extends (OptionType[K] extends string ? keyof OptionType: never)>
	extends Component<SyncedOptionProps<K> & { options: {value: string, label: string}[] }, SyncedOptionState<K>> {

	constructor(props: SyncedOptionProps<K> & { options: {value: string, label: string}[] }) {
		super(props);
		this.state = {};
		getPreference(this.props.optionkey).then(v=>
				this.setState({ val: v })
		);
	}

	onChange: React.ChangeEventHandler<HTMLSelectElement> = (ev) => {
		this.setState({ val: ev.target.value as OptionType[K] });
		chrome.storage.local.set({ [this.props.optionkey]: ev.target.value });
	};
	readonly onChromeStorageChanged: Parameters<typeof chrome.storage.onChanged.addListener>[0] = (changes, areaName) => {
		if (areaName !== "local" || !(this.props.optionkey in changes)) return;

		this.setState({val:changes[this.props.optionkey].newValue});
	}
	componentDidMount() {
		chrome.storage.onChanged.addListener(this.onChromeStorageChanged);
	}
	componentWillUnmount() {
		chrome.storage.onChanged.removeListener(this.onChromeStorageChanged);
	}
	render() {
		return <div className="optionItem">
			<label>{`${this.props.label}: `}</label>
			<select onChange={this.onChange} value={this.state.val as string ?? ""}>
				{this.props.options.map(option => 
					<option key={option.value} value={option.value}>{option.label}</option>
				)}
			</select>
		</div>;
	}
}

export class SyncedNumberInput<K extends (OptionType[K] extends string ? keyof OptionType: never)>
	extends Component<SyncedOptionProps<K> & { min?: number, max?: number, step?: number }, SyncedOptionState<K>> {

	constructor(props: SyncedOptionProps<K> & { min?: number, max?: number, step?: number }) {
		super(props);
		this.state = {};
		getPreference(this.props.optionkey).then(v=>
				this.setState({ val: v })
		);
	}

	onChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
		this.setState({ val: ev.target.value as OptionType[K] });
		chrome.storage.local.set({ [this.props.optionkey]: ev.target.value });
	};
	readonly onChromeStorageChanged: Parameters<typeof chrome.storage.onChanged.addListener>[0] = (changes, areaName) => {
		if (areaName !== "local" || !(this.props.optionkey in changes)) return;

		this.setState({val:changes[this.props.optionkey].newValue});
	}
	componentDidMount() {
		chrome.storage.onChanged.addListener(this.onChromeStorageChanged);
	}
	componentWillUnmount() {
		chrome.storage.onChanged.removeListener(this.onChromeStorageChanged);
	}
	render() {
		return <div className="optionItem">
			<label>{`${this.props.label}: `}</label>
			<input 
				type="number" 
				onChange={this.onChange} 
				value={this.state.val as string ?? ""} 
				min={this.props.min}
				max={this.props.max}
				step={this.props.step}
			/>
		</div>;
	}
}
