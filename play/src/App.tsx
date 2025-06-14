import { Component, createSignal, For, onMount, Show } from 'solid-js';
import { createStore } from "solid-js/store";
import { InputInstance, FormInstance, Form, show, usePopup, useRef, Input, InputNumber, FormItem, Badge, Icon, ConfigProvider, Button, Popconfirm, Popover, Tag, Backtop, Popper, Drawer } from 'solid-ui';

0 && show

const App: Component = () => {
  const [icon, setIcon] = createSignal('plus')
  let input: InputInstance | undefined;
  let formRef!: FormInstance;
  onMount(() => {
    console.log(input);
    input?.select()
  })
  const [state, setState] = createStore({ name: 'a' });
  const visible = useRef(false);
  function reset() {
    setState({
      name: undefined,
      hobby: undefined
    })
    usePopup(Drawer, {
      title: 'dialog',
      width: 500,
      children: () => <Form model={state}>
        <FormItem label='姓名' prop="name"><Input value={state.name} onChange={name => setState({ name })} /></FormItem>
        <div use:show={state.name}>
          <FormItem label='年龄' prop="age"><InputNumber value={state.age} onChange={age => setState({ age })} /></FormItem>
        </div>
        {
          state.age && <Badge value={state.age}>
            <Icon icon='ep:close' size={50} />
          </Badge>
        }
      </Form>
    })
    // const cleanup = usePopup(Message, { message: 'this is popup message', type: 'warning', duration: -1 })();
    // setTimeout(cleanup, 2000)
  }
  async function submit() {
    const result = await formRef.validate();
    console.log('result', result)
  }
  const items = [
    { type: '', label: 'Tag 1' },
    { type: 'success', label: 'Tag 2' },
    { type: 'info', label: 'Tag 3' },
    { type: 'danger', label: 'Tag 4' },
    { type: 'warning', label: 'Tag 5' },
  ]
  return (
    <div>
      <ConfigProvider >
        <Button onClick={() => visible.value = true}>open</Button>

        <Popper title="this is title" content="this is content" effect="dark" autoPlacement visible>
          <Button type='primary'>this is trigger</Button>
        </Popper>
        <Popconfirm title='Are you sure to delete this?' onConfirm={reset}>
          <Button>delete</Button>
        </Popconfirm>
        <Popover title="popover" content="Are you sure to delete this?">
          <Button type="warning">Popover</Button>
        </Popover>
        <For each={items}>
          {item => <Tag type={item.type}>{item.label}</Tag>}
        </For>
        <For each={items}>
          {item => <Tag type={item.type} effect="dark">{item.label}</Tag>}
        </For>
        <For each={items}>
          {item => <Tag type={item.type} effect="plain">{item.label}</Tag>}
        </For>
        <div style={{ width: 3000 + 'px', height: '1000px' }}></div>

        <Backtop right={100} bottom={100} />
      </ConfigProvider >
    </div >
  );
};

export default App;
