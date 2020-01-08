// hello.cc
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void host(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "127.0.0.1", NewStringType::kNormal).ToLocalChecked());
}

void port(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "3306", NewStringType::kNormal).ToLocalChecked());
}

void user(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "root", NewStringType::kNormal).ToLocalChecked());
}

void password(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "123456", NewStringType::kNormal).ToLocalChecked());
}

void database(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "addon", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "host", host);
  NODE_SET_METHOD(exports, "port", port);
  NODE_SET_METHOD(exports, "user", user);
  NODE_SET_METHOD(exports, "password", password);
  NODE_SET_METHOD(exports, "database", database);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // 命名空间示例
