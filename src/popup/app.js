import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core/styles';
import { INVALID_SCHEMA, PATTERN_SURL } from '../background/config'

const styles = theme => ({
    root: {
        display: 'flex',
    },
});

class SimpleMenu extends React.Component {

    onClick(pattern, tab) {
        this.props.authenticateUserAlias(pattern, tab)
        window.close()
    }

    render() {
        const { classes, patterns, tab } = this.props
        let p = patterns, r
        if (tab.url) {
            if (tab.url.match(INVALID_SCHEMA.join('|')))
                p = p.filter(pattern => pattern.indexOf(PATTERN_SURL) === -1)

            r = p.map(pattern => (<MenuItem key={pattern} onClick={() => this.onClick(pattern, tab)}>{pattern}</MenuItem>))
        }
        return (
            <div className={classes.root} >
                <MenuList>
                    {r}
                </MenuList>
            </div>
        );
    }
}

SimpleMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    patterns: state.default.patterns,
    tab: state.default.activetab.tab,
})


const mapDispatchToProps = dispatch => ({
    authenticateUserAlias: (pattern, tab) => {
        dispatch({
            type: 'user-clicked-alias',
            payload: {
                pattern,
                tab
            }
        })
    },
    loadCurrentTab: () => dispatch({
        type: 'get-current-tab',
    })
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SimpleMenu))