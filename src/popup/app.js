import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        display: 'flex',
    },
});

class SimpleMenu extends React.Component {

    onClick(pattern) {
        this.props.authenticateUserAlias(pattern)
        window.close()
    }

    render() {
        const { classes, patterns } = this.props;
        return (
            <div className={classes.root}>
                <MenuList>
                    {patterns.map(pattern => (<MenuItem key={pattern} onClick={() => this.onClick(pattern)}>{pattern}</MenuItem>))}
                </MenuList>
            </div>
        );
    }
}

SimpleMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    patterns: state.default.patterns
})


const mapDispatchToProps = dispatch => ({
    authenticateUserAlias(pattern) {
        dispatch({
            type: 'user-clicked-alias',
            pattern
        });
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SimpleMenu))