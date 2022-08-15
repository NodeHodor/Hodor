// Copyright (C) 2019, Rory Bradford <roryrjb@gmail.com>
// MIT License

#include "seccomp.h"
#include "stdio.h"

namespace seccomp {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Number;
using v8::Object;
using v8::Persistent;
using v8::String;
using v8::Value;

const char* ToCString(const v8::String::Utf8Value& value) {
  return *value;
}

Persistent<Function> NodeSeccomp::constructor;

NodeSeccomp::NodeSeccomp(scmp_filter_ctx ctx) : _ctx(ctx) {
}

NodeSeccomp::~NodeSeccomp() {
  seccomp_release(_ctx);
}

void NodeSeccomp::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();

  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(
      isolate, "NodeSeccomp", NewStringType::kNormal).ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  NODE_SET_PROTOTYPE_METHOD(tpl, "init", SeccompInit);
  NODE_SET_PROTOTYPE_METHOD(tpl, "reset", SeccompReset);
  NODE_SET_PROTOTYPE_METHOD(tpl, "load", SeccompLoad);
  NODE_SET_PROTOTYPE_METHOD(tpl, "addRule", SeccompRuleAdd);
  NODE_SET_PROTOTYPE_METHOD(tpl, "addRuleExact", SeccompRuleAddExact);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());
  exports->Set(context, String::NewFromUtf8(
      isolate, "NodeSeccomp", NewStringType::kNormal).ToLocalChecked(),
               tpl->GetFunction(context).ToLocalChecked()).FromJust();
}

void NodeSeccomp::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  scmp_filter_ctx ctx;

  if (args.IsConstructCall()) {
    NodeSeccomp* obj = new NodeSeccomp(ctx);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void NodeSeccomp::SeccompInit(const v8::FunctionCallbackInfo<v8::Value>& args) {
  Isolate* isolate = args.GetIsolate();
  NodeSeccomp* obj = ObjectWrap::Unwrap<NodeSeccomp>(args.Holder());

   if ((obj->_ctx = seccomp_init(args[0].As<v8::Number>()->Value())) == 0) {
    isolate->ThrowException(v8::Exception::TypeError(
      v8::String::NewFromUtf8(isolate, "Invalid argument.",
        v8::NewStringType::kNormal).ToLocalChecked()));
  } else {
    args.GetReturnValue().Set(args.This());
  }
}

void NodeSeccomp::SeccompReset(const v8::FunctionCallbackInfo<v8::Value>& args) {
  Isolate* isolate = args.GetIsolate();
  NodeSeccomp* obj = ObjectWrap::Unwrap<NodeSeccomp>(args.Holder());

   if ((seccomp_reset(obj->_ctx, args[0].As<v8::Number>()->Value())) != 0) {
    isolate->ThrowException(v8::Exception::TypeError(
      v8::String::NewFromUtf8(isolate, "Invalid argument.",
        v8::NewStringType::kNormal).ToLocalChecked()));
  }
}

void NodeSeccomp::SeccompLoad(const v8::FunctionCallbackInfo<v8::Value>& args) {
  NodeSeccomp* obj = ObjectWrap::Unwrap<NodeSeccomp>(args.Holder());
  seccomp_load(obj->_ctx);
}

void NodeSeccomp::SeccompRuleAddExact(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();
  NodeSeccomp* obj = ObjectWrap::Unwrap<NodeSeccomp>(args.Holder());

  int type = args[0].As<v8::Number>()->Value();
  v8::String::Utf8Value syscall_str(isolate, args[1]);

  if (seccomp_rule_add_exact(
    obj->_ctx,
    type,
    seccomp_syscall_resolve_name(ToCString(syscall_str)),
    0
  ) != 0) {
    isolate->ThrowException(v8::Exception::TypeError(
      v8::String::NewFromUtf8(isolate, "Invalid argument.",
        v8::NewStringType::kNormal).ToLocalChecked()));
  }
}

void NodeSeccomp::SeccompRuleAdd(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();
  NodeSeccomp* obj = ObjectWrap::Unwrap<NodeSeccomp>(args.Holder());

  int type = args[0].As<v8::Number>()->Value();
  v8::String::Utf8Value syscall_str(isolate, args[1]);

  if (seccomp_rule_add(
    obj->_ctx,
    type,
    seccomp_syscall_resolve_name(ToCString(syscall_str)),
    0
  ) != 0) {
    char errMsg[129] = {0};
    snprintf(errMsg, 128, "Invalid argument: %s", ToCString(syscall_str));
    isolate->ThrowException(v8::Exception::TypeError(
      v8::String::NewFromUtf8(isolate, errMsg,
        v8::NewStringType::kNormal).ToLocalChecked()));
  } else {
    args.GetReturnValue().Set(args.This());
  }
}

}  // namespace seccomp
