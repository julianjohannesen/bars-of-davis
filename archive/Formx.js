import React, { Component } from 'react';
import Level from 'react-bulma-components/lib/components/level/';
import Field from 'react-bulma-components/lib/components/form/components/field/field';
import Label from 'react-bulma-components/lib/components/form/components/label';
import Control from 'react-bulma-components/lib/components/form/components/control';
import Input from 'react-bulma-components/lib/components/form/components/input';
import Button from 'react-bulma-components/lib/components/button';

export default class Formx extends Component {

    key = 'AIzaSyAKidTbGki0g1eG1laz79qvkDVLMYVxLOU';
    state = { filterInput: "",}

    // handleChange
    handleChange = (event) => {
        console.log(`This is the event target value ${event.target.value}`)
        this.setState({ filterInput: event.target.value,})
    }

    // handleSubmit 
    handleSubmit = (event) => {
        event.preventDefault()
    }

    render() {
        return (
            <form id="filterForm" className="level-item" noValidate onSubmit={this.handleSubmit}>
                <Field className="has-addons">
                    <Label htmlFor="filterInput" >Filter</Label>
                    <Control  >
                        <Input
                            id="filterInput"
                            name="filterInput"
                            onBlur={this.handleChange}
                            onChange={this.handleChange}
                            required
                            title="Enter a ...."
                            type="text"
                            value={this.state.filterInput}
                        />
                    </Control>
                
                    <Control  >
                        <Button submit={true} type="primary">
                            Submit
                        </Button>
                    </Control>
                </Field>
            </form>
        );
    }
}
