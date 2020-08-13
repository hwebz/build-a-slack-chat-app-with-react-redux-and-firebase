import React, { useState } from 'react';
import { Grid, Header, Icon, Form, Segment, Button, Message} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    
    const handleChange = e => {
        const {name, value} = e.target;
        switch(name) {
            case "username":
                setUsername(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "passwordConfirmation":
                setPasswordConfirmation(value);
                break;
            default:
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        // Enable sign-in methods in Authentication tab of Firebase
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(createdUser => {
                console.log(createdUser);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h2" icon color="orange" textAlign="center">
                    <Icon name="puzzle piece" color="orange" />
                    Register for DevChat
                </Header>
                <Form size="large" onSubmit={handleSubmit}>
                    <Segment>
                        <Form.Input
                            fluid
                            name="username"
                            icon="user"
                            iconPosition="left"
                            placeholder="Username"
                            onChange={handleChange}
                            type="text"
                            value={username}
                        />
                        <Form.Input
                            fluid
                            name="email"
                            icon="mail"
                            iconPosition="left"
                            placeholder="Email"
                            onChange={handleChange}
                            type="email"
                            value={email}
                        />
                        <Form.Input
                            fluid
                            name="password"
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            onChange={handleChange}
                            type="password"
                            value={password}
                        />
                        <Form.Input
                            fluid
                            name="passwordConfirmation"
                            icon="refresh"
                            iconPosition="left"
                            placeholder="Password Confirmation"
                            onChange={handleChange}
                            type="password"
                            value={passwordConfirmation}
                        />
                        <Button color="orange" fluid size="large">Submit</Button>
                    </Segment>
                </Form>
                <Message>Already a user? <Link to="/login">Login</Link></Message>
            </Grid.Column>
        </Grid>
    )
};

export default Register;