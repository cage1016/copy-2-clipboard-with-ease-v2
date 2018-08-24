import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import { CloseSnackbar } from '../background/reducers/snackbar'
import { TabIdentifierClient } from "chrome-tab-identifier"

const tabIdClient = new TabIdentifierClient();


const styles = theme => ({
    root: {
        display: 'flex',
    },
});

class PositionedSnackbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabId: ''
        }
    }

    componentDidMount() {
        tabIdClient.getTabId().then(tabId => {
            this.setState({
                tabId
            })
        })
    }

    render() {
        const { snackbar } = this.props
        const { tabId } = this.state
        return (
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: snackbar.vertical, horizontal: snackbar.horizontal }}
                    open={snackbar.open && snackbar.tabId === tabId}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    onClose={this.props.CloseSnackbar}
                    autoHideDuration={snackbar.autoHideDuration}
                    message={<span id="message-id">{snackbar.msg}</span>}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    snackbar: state.default.snackbar
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            CloseSnackbar,
        },
        dispatch
    )

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(PositionedSnackbar))