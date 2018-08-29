import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import { groupBy, chain, toPairs, without } from 'lodash'
import { ToggleDefaultPattern, RemoveCustomPattern } from '../background/reducers/patterns'
import Dialog from './dialog'

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        // position: 'relative',
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
    },
    fab: {
        position: 'fixed',
        bottom: '1rem',
        right: '1rem'
    },
});


class Options extends React.Component {

    state = {
        open: false,
        checked: [0],
        value: 0
    };

    updatePattern = (item) => {
        this.props.ToggleDefaultPattern(item)
    }

    handleToggle = ({ pattern: value, type }) => {
        if (type === 'default') return

        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        const [_, ...text] = newChecked
        if (text.length > 0) {
            this.setState({ value: 1 })
        } else {
            this.setState({ value: 0 })
        }

        this.setState({
            checked: newChecked,
        });
    }

    handleFabClick = () => {
        const { value, checked } = this.state

        switch (value) {
            case 0:
                this.setState({ open: true })
                break;
            case 1:
                const [_, ...patterns] = checked
                const newChecked = [...checked]
                this.props.RemoveCustomPattern({ patterns })
                this.setState({ value: 0, checked: without(newChecked, ...patterns) })
                break;

            default:
                break;
        }
    }

    render() {
        const { classes, patterns, theme } = this.props;
        const { open } = this.state;

        const transitionDuration = {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
        }

        const fabs = [
            {
                color: 'primary',
                className: classes.fab,
                icon: <AddIcon />,
            },
            {
                color: 'secondary',
                className: classes.fab,
                icon: <DeleteIcon />,
            },
        ];

        const xx = chain(patterns)
            .groupBy('type')
            .toPairs()
            .map(([type, patterns], key) => ({ type, patterns }))
            .value()

        return (
            <React.Fragment>
                <CssBaseline />
                <AppBar position="absolute" color="default" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" noWrap>
                            Copy 2 clipboard with ease
                        </Typography>
                    </Toolbar>
                </AppBar>
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography variant="display1" align="center">
                            Patterns
                        </Typography>

                        {xx.map((o) => (
                            <List key={o.type} component="nav" subheader={<ListSubheader>{o.type}</ListSubheader>}>
                                {o.patterns.map(item => (
                                    <ListItem onClick={() => this.handleToggle(item)} key={item.pattern} button>
                                        {o.type === 'custom' && (
                                            <Checkbox
                                                checked={this.state.checked.indexOf(item.pattern) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                                style={{ height: 0 }}
                                            />
                                        )}
                                        <ListItemText inset primary={item.pattern.replace(/ /g, "\u00a0")} />
                                        <ListItemSecondaryAction>
                                            <Switch
                                                onChange={() => this.updatePattern(item)}
                                                checked={item.isEnable}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        ))}
                        {fabs.map((fab, index) => (
                            <Zoom
                                key={fab.color}
                                in={this.state.value === index}
                                timeout={transitionDuration}
                                style={{
                                    transitionDelay: `${this.state.value === index ? transitionDuration.exit : 0}ms`,
                                }}
                                unmountOnExit
                            >
                                <Button variant="fab" className={fab.className} color={fab.color} onClick={() => this.handleFabClick()}>
                                    {fab.icon}
                                </Button>
                            </Zoom>
                        ))}

                        <Dialog open={open} close={() => this.setState({ open: false })} />
                    </Paper>
                </main>
            </React.Fragment>
        );
    }
}

Options.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    patterns: state.default.patterns,
})


const mapDispatchToProps = dispatch => bindActionCreators(
    {
        ToggleDefaultPattern,
        RemoveCustomPattern
    },
    dispatch
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(Options))