import React, { Component } from 'react';
import { object, string, func } from 'prop-types';
import { Controlled } from 'react-codemirror2';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/display/placeholder';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/theme/material.css';
import './yaml-lint';
import './json-lint';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { load, dump } from 'js-yaml';

Number;

@withStyles({
  root: {
    width: '100%',
    '& .CodeMirror pre.CodeMirror-placeholder': {
      color: '#999',
    },
  },
  controlls: {
    position: 'absolute',
    right: '30px',
    marginTop: '10px',
    marginRight: '10px',
    zIndex: 30,
  },
})
/** Render an editor.
 *
 * _Note: [material-ui](https://material-ui.com/) is a peer-dependency_
 */
export default class CodeEditor extends Component {
  static propTypes = {
    /** Callback function fired when the editor is changed. */
    onChange: func,
    /** The value of the editor. */
    value: string.isRequired,
    /** Code mirror options */
    options: object,
    /** The CSS class name of the wrapper element */
    className: string,
  };

  static defaultProps = {
    onChange: null,
    options: null,
    className: null,
  };

  handleTextUpdate = (editor, data, value) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  constructor(props) {
    super(props);
    this.state = { mode: props.mode };
  }

  render() {
    const { classes, className, value, onChange: _, ...options } = this.props;
    const opts = {
      theme: 'material',
      indentWithTabs: false,
      extraKeys: { Tab: false },
      gutters: ['CodeMirror-lint-markers'],
      lineNumbers: true,
      ...options,
    };

    return (
      <React.Fragment>
        <div className={classNames(classes.controlls, className)}>
          <IconButton
            aria-label="Copy"
            onClick={() => {
              navigator.clipboard.writeText(value);
            }}>
            <FileCopyIcon />
          </IconButton>
          <IconButton
            aria-label="Convert to yaml"
            onClick={() => {
              if (this.state.mode !== 'yaml') {
                const obj = JSON.parse(value);

                if (this.props.onChange) {
                  this.props.onChange(dump(obj));
                }
              }

              this.setState({ mode: 'yaml' });
            }}>
            yaml
          </IconButton>
          <IconButton
            aria-label="Convert to JSON"
            onClick={() => {
              if (this.state.mode !== 'javascript') {
                const obj = load(value);

                if (this.props.onChange) {
                  this.props.onChange(JSON.stringify(obj, undefined, 4));
                }
              }

              this.setState({ mode: 'javascript' });
            }}>
            json
          </IconButton>
        </div>
        <Controlled
          className={classNames(classes.root, className)}
          options={{ ...opts, mode: this.state.mode }}
          onBeforeChange={this.handleTextUpdate}
          value={value}
        />
      </React.Fragment>
    );
  }
}
